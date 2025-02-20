const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mediasoup = require("mediasoup");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

let worker;
let router;
const transports = {};
const producers = {};
const consumers = {};
const clients = {}; // roomId 별로 연결된 사용자 관리

// 클라이언트 별로 생성한 Producer를 추적 (socket.id => [{ roomId, producerId }, ...])
const producerOwners = {};

const createWorker = async () => {
    console.log("🛠️ Creating Mediasoup Worker...");
    worker = await mediasoup.createWorker();

    if (!worker) {
        console.error("❌ Worker 생성 실패!");
        return;
    }

    router = await worker.createRouter({
        mediaCodecs: [
            { kind: "audio", mimeType: "audio/opus", clockRate: 48000, channels: 2 },
            { kind: "video", mimeType: "video/VP8", clockRate: 90000 },
        ],
    });

    if (!router) {
        console.error("❌ Router 생성 실패!");
        return;
    }

    console.log("  Mediasoup Worker & Router Created!");
};

io.on("connection", (socket) => {
    console.log("  New client connected:", socket.id);

    socket.on("getRouterRtpCapabilities", (callback) => {
        if (!router) {
            console.error("❌ Router가 아직 생성되지 않음!");
            return callback({ error: "Router가 아직 생성되지 않았습니다." });
        }
        console.log("📡 Sending Router RTP Capabilities...");
        callback(router.rtpCapabilities);
    });

    socket.on("createTransport", async (callback) => {
        console.log("📡 [서버] createTransport 요청 수신"); // 서버가 이벤트를 수신하면 출력
        try {
            const transport = await router.createWebRtcTransport({
                listenIps: [{ ip: "0.0.0.0", announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP }],
                enableUdp: true,
                enableTcp: true,
                preferUdp: true,
                appData: { clientId: socket.id }, // ✅ 클라이언트 정보 추가
            });

            transports[transport.id] = transport;

            console.log("🚀 [서버] Transport 생성:", transport.id);

            console.log("🧊 iceParameters:", transport.iceParameters);
            console.log("❄️ iceCandidates:", transport.iceCandidates);
            console.log("🔐 dtlsParameters:", transport.dtlsParameters);

            callback({
                id: transport.id,
                iceParameters: transport.iceParameters,
                iceCandidates: transport.iceCandidates || [],
                dtlsParameters: transport.dtlsParameters,
            });
        } catch (error) {
            console.error("❌ Transport 생성 실패:", error);
            callback({ error: error.message });
        }
    });

    socket.on("connectTransport", async ({ transportId, dtlsParameters }, callback) => {
        const transport = transports[transportId];

        if (!transport) {
            console.error("❌ Transport를 찾을 수 없음:", transportId);
            return callback({ error: "Transport not found" });
        }

        try {
            await transport.connect({ dtlsParameters });
            console.log("  Transport 연결 완료:", transportId);
            callback({ success: true });
        } catch (error) {
            console.error("❌ Transport 연결 실패:", error);
            callback({ error: error.message });
        }
    });

    socket.on("produce", async ({ roomId, transportId, kind, rtpParameters }, callback) => {
        console.log(`📡 [produce] 요청: Room ID=${roomId}, Kind=${kind}, Transport=${transportId}`);

        if (!roomId) return callback({ error: "roomId가 필요합니다." });

        const transport = transports[transportId];
        if (!transport) return callback({ error: "Transport not found" });

        try {
            const producer = await transport.produce({ kind, rtpParameters });

            producers[roomId] = producers[roomId] || [];
            producers[roomId].push(producer.id);

            callback({ id: producer.id });

            console.log(`✅ Producer created: ${producer.id} (Room: ${roomId})`);

            const otherUsers = (clients[roomId] || []).filter((id) => id !== socket.id);

            if (otherUsers.length > 0) {
                console.log(`🎯 Sending triggerConsumeNew to other users:`, otherUsers);
                otherUsers.forEach((userId) => {
                    io.to(userId).emit("triggerConsumeNew", {
                        producerId: producer.id,
                        roomId,
                        transportId: transport.id, // ✅ 소비자 생성에 필요한 transport ID 추가
                        kind,                       // ✅ 오디오/비디오 종류
                        rtpParameters,              // ✅ RTP 파라미터 포함
                    });
                });
            } else {
                console.warn(`⚠️ No other users to notify in Room ${roomId}`);
            }
        } catch (error) {
            console.error("❌ Producer creation failed:", error);
            callback({ error: error.message });
        }
    });

    socket.on("closeProducer", ({ producerId, roomId }) => {
        console.log(`📴 Closing Producer ${producerId} in Room ${roomId}`);

        if (!producers[roomId]) return;

        producers[roomId] = producers[roomId].filter((id) => id !== producerId);
        if (producers[roomId].length === 0) delete producers[roomId];

        console.log("📡 Updated Producers List:", producers);

        io.to(roomId).emit("removeConsumer", { producerId });
    });

    socket.on("getProducers", ({ roomId }, callback) => {
        const roomKey = String(roomId);

        if (!roomKey) {
            console.error("❌ [getProducers] roomId가 undefined입니다!");
            return callback([]);
        }

        const producerList = producers[roomKey] || [];
        callback(producerList);
    });

    socket.on("consume", async ({ roomId, transportId, producerId, rtpCapabilities }, callback) => {
        console.log(`🎥 [consume] Room: ${roomId}, Consumer: ${socket.id}, Producer: ${producerId}`);

        const transport = transports[transportId];
        if (!transport) {
            console.error("❌ Transport not found:", transportId);
            return callback({ error: "Transport not found" });
        }

        if (!router.canConsume({ producerId, rtpCapabilities })) {
            console.error("❌ Cannot consume producer:", producerId);
            return callback({ error: "Cannot consume Producer" });
        }

        try {
            const consumer = await transport.consume({
                producerId,
                rtpCapabilities,
                paused: false,
            });

            consumers[roomId] = consumers[roomId] || {};
            consumers[roomId][socket.id] = consumer;

            console.log(`✅ Consumer created: ${consumer.id} (Room: ${roomId})`);

            callback({
                id: consumer.id,
                producerId: consumer.producerId,
                kind: consumer.kind,
                rtpParameters: consumer.rtpParameters,
            });
        } catch (error) {
            console.error("❌ Consumer creation failed:", error);
            callback({ error: error.message });
        }
    });

    socket.on("joinRoom", ({ roomId }) => {
        if (!clients[roomId]) clients[roomId] = [];

        if (!clients[roomId].includes(socket.id)) {
            clients[roomId].push(socket.id);
            console.log(`👤 Client ${socket.id} joined Room ${roomId}`);
        } else {
            console.warn(`⚠️ Client ${socket.id} already in Room ${roomId}`);
        }

        const roomProducers = producers[roomId] || [];
        if (roomProducers.length > 0) {
            console.log(`📢 Sending existing producers to new client: ${roomProducers}`);
            roomProducers.forEach((producerId) => {
                io.to(socket.id).emit("triggerConsumeNew", { producerId, roomId });
            });
        }
    });

    socket.on("disconnect", async () => {
        console.log(`❌ Client disconnected: ${socket.id}`);

        // 1️⃣ 소비자(Consumers) 제거
        Object.entries(consumers).forEach(([roomId, roomConsumers]) => {
            const consumer = roomConsumers[socket.id];
            if (consumer) {
                console.log(`🗑️ Closing consumer ${consumer.id} for client ${socket.id} in Room ${roomId}`);
                consumer.close();  // 실제 Mediasoup Consumer 제거
                delete roomConsumers[socket.id];
            }

            if (Object.keys(roomConsumers).length === 0) {
                delete consumers[roomId];
            }
        });

        // 2️⃣ 생산자(Producers) 제거
        if (producerOwners[socket.id]) {
            producerOwners[socket.id].forEach(({ roomId, producerId }) => {
                const roomProducers = producers[roomId];
                if (roomProducers) {
                    producers[roomId] = roomProducers.filter((id) => id !== producerId);
                    console.log(`🗑️ Removed producer ${producerId} from Room ${roomId}`);
                    io.to(roomId).emit("removeConsumer", { producerId }); // 소비자에게 해당 producer 삭제 알림
                }
            });
            delete producerOwners[socket.id];
        }

        // 3️⃣ 전송기(Transports) 제거
        Object.entries(transports).forEach(([transportId, transport]) => {
            if (transport.appData?.clientId === socket.id) {
                console.log(`🗑️ Closing transport ${transportId} for client ${socket.id}`);
                transport.close();
                delete transports[transportId];
            }
        });

        // 4️⃣ clients 리스트에서 제거
        Object.entries(clients).forEach(([roomId, users]) => {
            clients[roomId] = users.filter((id) => id !== socket.id);
            if (clients[roomId].length === 0) {
                delete clients[roomId];
                console.log(`🏠 Room ${roomId} is now empty and removed.`);
            }
        });
        console.log("✅ Clean-up completed for disconnected client:", socket.id);
    });

    socket.on("triggerConsume", ({ roomId }) => {
        console.log(`📡 Received request to trigger consumption in Room ${roomId}`);

        const currentProducers = producers[roomId];
        if (!currentProducers || currentProducers.length === 0) {
            console.log(`⚠️ No producers found in Room ${roomId}`);
            return;
        }

        const existingClients = clients[roomId] || [];
        console.log(`👤 Producers in Room ${roomId}:`, currentProducers);
        console.log(`👥 Clients in Room ${roomId}:`, existingClients);

        const otherUsers = existingClients.filter((id) => id !== socket.id);

        if (otherUsers.length > 0) {
            console.log(`🎯 Sending triggerConsumeNew with producers to other users in Room ${roomId}:`, otherUsers);
            otherUsers.forEach((userId) => {
                io.to(userId).emit("triggerConsumeNew", { producerIds: currentProducers, roomId });  // ✅ producerIds 포함
            });
        } else {
            console.warn(`⚠️ No other users in Room ${roomId} to send triggerConsume.`);
        }
    });
});

server.listen(4000, async () => {
    await createWorker();
    console.log("🚀 Mediasoup Server running on port 4000");
});
