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
        try {
            const transport = await router.createWebRtcTransport({
                listenIps: [{ ip: "0.0.0.0", announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP }],
                enableUdp: true,
                enableTcp: true,
                preferUdp: true,
            });

            transports[transport.id] = transport;

            console.log("  Transport Created:", transport.id);

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

        if (!roomId) {
            console.error("❌ [produce] roomId가 없음!");
            return callback({ error: "roomId가 필요합니다." });
        }

        const transport = transports[transportId];
        if (!transport) {
            console.error("❌ [produce] Transport를 찾을 수 없음:", transportId);
            return callback({ error: "Transport not found" });
        }

        try {
            const producer = await transport.produce({ kind, rtpParameters });
            const roomKey = String(roomId);
            if (!producers[roomKey]) {
                producers[roomKey] = [];
            }
            producers[roomKey].push(producer.id);
            console.log(`  [produce] Room ${roomKey}에 Producer 추가됨:`, producer.id);
            callback({ id: producer.id });

            // producerOwners에 현재 소켓의 producer 정보 기록
            if (!producerOwners[socket.id]) {
                producerOwners[socket.id] = [];
            }
            producerOwners[socket.id].push({ roomId, producerId: producer.id });

            // 새롭게 생성된 Producer를 다른 사용자들에게 consume 요청
            const existingClients = clients[roomId] || [];
            const otherUsers = existingClients.filter((id) => id !== socket.id);
            console.log(`🎯 Sending new consume request for producer ${producer.id} to:`, otherUsers);
            otherUsers.forEach((userId) => {
                io.to(userId).emit("triggerConsumeNew", { producerId: producer.id, roomId });
            });
        } catch (error) {
            console.error("❌ [produce] Producer 생성 실패:", error);
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
        console.log(`🎥 [consume] Room ID: ${roomId}, Consumer: ${socket.id}, Producer ID: ${producerId}`);

        if (!roomId) {
            console.error("❌ ERROR: Room ID is undefined!");
            return callback({ error: "Room ID is required!" });
        }

        const transport = transports[transportId];
        if (!transport) {
            console.error("❌ Transport를 찾을 수 없음:", transportId);
            return callback({ error: "Transport not found" });
        }

        if (!router.canConsume({ producerId, rtpCapabilities })) {
            console.error("❌ Cannot consume Producer:", producerId);
            return callback({ error: "Cannot consume Producer" });
        }

        try {
            const consumer = await transport.consume({
                producerId,
                rtpCapabilities,
                paused: false,
            });

            if (!consumers[roomId]) consumers[roomId] = {};
            consumers[roomId][socket.id] = consumer;

            console.log(`  [consume] Room ID: ${roomId}, Consumer ID: ${consumer.id}`);
            callback({
                id: consumer.id,
                producerId: consumer.producerId,
                kind: consumer.kind,
                rtpParameters: consumer.rtpParameters,
            });
        } catch (error) {
            console.error("❌ [consume] Consumer 생성 실패:", error);
            callback({ error: error.message });
        }
    });

    socket.on("joinRoom", ({ roomId }) => {
        if (!clients[roomId]) clients[roomId] = [];
        clients[roomId].push(socket.id);
        console.log(`👤 Client ${socket.id} joined Room ${roomId}`);
    });

    socket.on("disconnect", () => {
        console.log("❌ Client Disconnected:", socket.id);

        // 클라이언트가 나가면 clients 리스트에서 제거
        Object.keys(clients).forEach((roomId) => {
            clients[roomId] = clients[roomId].filter((id) => id !== socket.id);
            if (clients[roomId].length === 0) delete clients[roomId];
        });
        console.log("📡 Updated clients list:", clients);

        // producerOwners 에 기록된 본인 producer들을 cleanup
        if (producerOwners[socket.id]) {
            producerOwners[socket.id].forEach(({ roomId, producerId }) => {
                console.log(`📴 Cleaning up Producer ${producerId} for disconnected socket ${socket.id} in Room ${roomId}`);
                if (producers[roomId]) {
                    producers[roomId] = producers[roomId].filter((id) => id !== producerId);
                    // 소비자들에게 해당 producer 삭제 알림 전송
                    io.to(roomId).emit("removeConsumer", { producerId });
                }
            });
            delete producerOwners[socket.id];
        }
    });

    socket.on("triggerConsume", ({ roomId }) => {
        console.log(`📡 Received request to trigger consumption in Room ${roomId}`);

        if (!producers[roomId] || producers[roomId].length === 0) {
            console.log(`⚠️ No producers found in Room ${roomId}`);
            return;
        }

        const currentProducers = producers[roomId];
        const existingClients = clients[roomId] || [];

        console.log(`👤 Producers in Room ${roomId}:`, currentProducers);
        console.log(`👥 Clients in Room ${roomId}:`, existingClients);

        const otherUsers = existingClients.filter((id) => id !== socket.id);

        if (otherUsers.length > 0) {
            console.log(`🎯 Sending triggerConsume to other users in Room ${roomId}:`, otherUsers);
            otherUsers.forEach((userId) => {
                io.to(userId).emit("triggerConsume");
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
