"use client"

import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import io from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";

const SERVER_URL = "http://localhost:8080/chat";
const USER_SESSION_URL = "http://localhost:8080/user/me";
const SOCKET_SERVER_URL = "http://localhost:4000"; // ✅ WebRTC 서버
// const currentUserId = "61000000-0000-0000-0000-000000000000";

const Chat1 = () => {
  /* ✅ 기존 채팅 상태들 */
  const [stompClient, setStompClient] = useState(null);
  const [myRooms, setMyRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const subscriptionRef = useRef(null);
  const [isOpenChat, setIsOpenChat] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [roomName, setRoomName] = useState("");

  /* ✅ WebRTC 상태 */
  const [socket, setSocket] = useState(null);
  const [device, setDevice] = useState(null);
  const [producerTransport, setProducerTransport] = useState(null);
  const [consumerTransport, setConsumerTransport] = useState(null);
  const [producer, setProducer] = useState(null);
  const [consumer, setConsumer] = useState(null);
  const [isProducing, setIsProducing] = useState(false); // ✅ 현재 내가 방송 중인지 체크
  const [isConsuming, setIsConsuming] = useState(false); // ✅ 현재 내가 시청 중인지 체크
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);

  /* ✅ 로그인 사용자 정보 */
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userNickname, setUserNickname] = useState("");

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await fetch(USER_SESSION_URL, {
          credentials: "include",
        });
        if (!response.ok)
          throw new Error("세션 정보를 불러오는 데 실패했습니다.");

        const data = await response.json();
        setCurrentUserId(data.userId);
        setUserNickname(data.userNickname);
        console.log("✅ 로그인한 사용자:", data.userNickname);
      } catch (error) {
        console.error("❌ 사용자 정보를 가져오는 데 실패했습니다:", error);
        setCurrentUserId(null); // ✅ 로그아웃 상태 설정
      }
    };

    fetchUserSession();
  }, []);

  /* ✅ WebSocket 및 WebRTC 초기화 */
  useEffect(() => {
    if (!currentUserId) return;

    const socket = new SockJS(SERVER_URL);
    const client = Stomp.over(socket);
    const rtcSocket = io(SOCKET_SERVER_URL, { transports: ["websocket"] });

    client.connect({}, () => {
      console.log("✅ Stomp WebSocket Connected");
      client.subscribe(`/topic/chat/myRooms/${currentUserId}`, updateMyRooms);
      client.subscribe(`/topic/chat/roomUpdated/${currentUserId}`, () => {
        client.send("/app/chat/myRooms/" + currentUserId, {}, {});
      });

      client.send("/app/chat/myRooms/" + currentUserId, {}, {});
    });

    setStompClient(client);
    setSocket(rtcSocket);

    rtcSocket.emit("getRouterRtpCapabilities", async (rtpCapabilities) => {
      const newDevice = new mediasoupClient.Device();
      await newDevice.load({ routerRtpCapabilities: rtpCapabilities });
      setDevice(newDevice);
    });

    return () => {
      if (client) client.disconnect();
      if (rtcSocket) rtcSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (currentRoom) {
        console.log(
          `🚀 Leaving room ${currentRoom.id}. Updating last seen time...`
        );

        // ✅ 🔹 Redis에서 사용자 퇴장 처리
        await fetch(`${SERVER_URL}/room/leave?roomId=${currentRoom.id}`, {
          method: "POST",
        });
        await fetch(`${SERVER_URL}/last-seen?roomId=${currentRoom.id}`, {
          method: "POST",
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentRoom]);

  useEffect(() => {
    if (!socket || !currentRoom) return;

    // ✅ 상대가 화면을 끄면 내 remote 비디오를 정리하는 이벤트 추가
    const handleStopStreaming = ({ roomId }) => {
      if (currentRoom.id === roomId) {
        console.log(
          "📴 상대방이 방송을 중지했습니다. 내 remote 화면을 끕니다."
        );

        // ✅ remote 비디오 정리
        if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
          let stream = remoteVideoRef.current.srcObject;
          stream.getTracks().forEach((track) => track.stop());
          remoteVideoRef.current.srcObject = null;
        }

        setConsumer(null);
        setIsConsuming(false);
      }
    };

    socket.on("stopStreaming", handleStopStreaming);

    return () => {
      socket.off("stopStreaming", handleStopStreaming);
    };
  }, [socket, currentRoom]);

  useEffect(() => {
    if (!socket || !currentRoom) return;

    const handleNewProducerConsume = async ({ producerId, roomId }) => {
      console.log(
        `📡 Received new Producer ID=${producerId} in Room ${roomId}. Starting consume...`
      );

      socket.emit("createTransport", (data) => {
        const transport = device.createRecvTransport(data);

        transport.on("connect", async ({ dtlsParameters }, callback) => {
          socket.emit(
            "connectTransport",
            { transportId: data.id, dtlsParameters },
            callback
          );
        });

        setConsumerTransport(transport);

        console.log(`🎥 [consume] 요청: Producer ID=${producerId}`);
        socket.emit(
          "consume",
          {
            roomId: String(roomId),
            transportId: data.id,
            producerId,
            rtpCapabilities: device.rtpCapabilities,
          },
          async (data) => {
            if (!data || data.error) {
              console.error("❌ [consume] ERROR:", data.error);
              return;
            }

            console.log("✅ [consume] 받은 데이터:", data);

            const consumer = await transport.consume({
              id: data.id,
              producerId: data.producerId,
              kind: data.kind,
              rtpParameters: data.rtpParameters,
            });

            setConsumer(consumer);
            const stream = new MediaStream();
            stream.addTrack(consumer.track);

            if (data.kind === "video") {
              console.log("📡 [consume] 비디오 스트림 설정");
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream; // ✅ 새로운 Producer 비디오 표시
              }
            }
          }
        );
      });
    };

    socket.on("triggerConsumeNew", handleNewProducerConsume);

    return () => {
      socket.off("triggerConsumeNew", handleNewProducerConsume);
    };
  }, [socket, currentRoom]);

  useEffect(() => {
    if (!socket || !currentRoom) return;

    console.log("📡 Joining Room:", currentRoom.id);
    socket.emit("joinRoom", { roomId: currentRoom.id });

    return () => {
      console.log("🚪 Leaving Room:", currentRoom.id);
      socket.emit("leaveRoom", { roomId: currentRoom.id });
    };
  }, [socket, currentRoom]);

  const toggleVideoStreaming = async () => {
    if (!device || !currentRoom || isOpenChat || !currentRoom.id) {
      console.error("❌ Invalid Room or Device not initialized!");
      return;
    }

    if (isStreaming) {
      stopVideoStreaming(); // ✅ 현재 스트리밍 중이면 끄기
      setIsStreaming(false); // ✅ Stop 후 상태 초기화
      setIsProducing(false);
      return;
    }

    console.log(`📡 Checking existing producers in Room ID=${currentRoom.id}`);

    const producerIds = await new Promise((resolve) => {
      socket.emit("getProducers", { roomId: String(currentRoom.id) }, resolve);
    });

    if (producerIds.length > 0) {
      console.log("🎥 Existing Producers found. Consuming first...");

      // ✅ Step 1: Consume 먼저 실행 (방송 시청)
      await startConsuming(producerIds);
      setIsConsuming(true);

      // ✅ Step 2: Produce (내 방송 시작)
      console.log("📡 Now Producing...");
      await startPublishing();
      setIsProducing(true);

      // ✅ Step 3: 서버에 기존 Producer들에게 Consume 요청 보내기
      console.log("📡 Requesting existing Producers to consume...");
      socket.emit("triggerConsume", { roomId: currentRoom.id });
    } else {
      console.log("📡 No Producers found. Starting as Producer...");
      await startPublishing();
      setIsProducing(true);
    }

    setIsStreaming(true); // ✅ 스트리밍 상태 ON
  };

  const stopVideoStreaming = () => {
    console.log("📴 Stopping video stream...");

    if (producer && typeof producer.close === "function") {
      producer.close(); // ✅ 송출 중단
      setProducer(null);
    } else {
      console.warn("⚠️ Producer is already closed or undefined.");
    }

    // ✅ 서버에 현재 사용자의 송출 중단 알리기
    socket.emit("stopStreaming", { roomId: currentRoom.id });

    // ✅ Local Video 화면 비우기
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      let stream = localVideoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }

    setIsStreaming(false);
    setIsProducing(false);
  };

  const updateMyRooms = (message) => {
    setMyRooms(JSON.parse(message.body));
  };

  const fetchMessagesAndConnect = async (roomId, roomName, openChat) => {
    // ✅ 기존 WebSocket 구독이 있으면 해제 (중복 구독 방지)
    if (subscriptionRef.current) subscriptionRef.current.unsubscribe();

    setCurrentRoom({ id: roomId, name: roomName, isOpenChat: openChat });
    setIsOpenChat(openChat);
    setIsActive(true);

    try {
      // ✅ 🔹 방에 입장할 때 Redis에 업데이트
      await fetch(`${SERVER_URL}/room/join?roomId=${roomId}`, {
        method: "POST",
      });
      // ✅ 1️⃣ 채팅 메시지 불러오기
      const response = await fetch(`${SERVER_URL}/messages/${roomId}`);
      if (!response.ok)
        throw new Error(
          `Failed to fetch messages (Status: ${response.status})`
        );

      const chatMessages = await response.json();

      // ✅ 2️⃣ 마지막 접속 시간 불러오기 (Redis에서 조회)
      let lastSeenTime = 0;
      try {
        const lastSeenResponse = await fetch(
          `${SERVER_URL}/last-seen?roomId=${roomId}`
        );
        if (lastSeenResponse.ok) {
          lastSeenTime = await lastSeenResponse.json();
        }
      } catch (err) {
        console.warn("⚠️ Error fetching last seen time:", err);
      }

      // ✅ 3️⃣ 읽음 여부 반영
      const processedMessages = chatMessages.map((msg) => ({
        ...msg,
        isRead: new Date(msg.timestamp).getTime() <= lastSeenTime,
      }));

      setMessages(processedMessages); // 기존 메시지를 유지하면서 업데이트
    } catch (error) {
      console.error("❌ 메시지 조회 실패:", error);
    }

    // ✅ 4️⃣ WebSocket 메시지 실시간 구독
    const sub = stompClient.subscribe(`/topic/messages/${roomId}`, (msg) => {
      const newMessage = JSON.parse(msg.body);
      setMessages((prev) => [...prev, newMessage]);
    });

    subscriptionRef.current = sub;
  };

  const startPrivateChat = () => {
    const selectedUserId = prompt("Enter User ID to start a private chat:");
    if (!selectedUserId) return;

    stompClient.send(
      "/app/chat.private",
      {},
      JSON.stringify({
        user1: currentUserId,
        user2: selectedUserId,
      })
    );

    stompClient.subscribe(`/topic/newRoom/${currentUserId}`, (message) => {
      const privateRoom = JSON.parse(message.body);
      fetchMessagesAndConnect(privateRoom.roomId, privateRoom.name, false);

      // ✅ 1:1 채팅 생성 후 즉시 내 방 목록 새로고침
      stompClient.send("/app/chat/myRooms/" + currentUserId, {}, {});
    });
  };

  const leaveRoom = () => {
    if (isOpenChat || !currentRoom) return;

    console.log(`🚪 Leaving Room: ${currentRoom.id}, Setting is_active: false`);

    stompClient.send(
      "/app/chat.leaveRoom",
      {},
      JSON.stringify({
        roomId: currentRoom.id,
        userIds: [currentUserId],
        is_active: false,
      })
    );

    setCurrentRoom(null);
    setMessages([]);
    setIsActive(false);

    // ✅ 서버 변경 반영 후 500ms 후 방 목록 새로고침 (반응 속도 개선)
    setTimeout(() => {
      stompClient.send("/app/chat/myRooms/" + currentUserId, {}, {});
    }, 500);
  };

  const sendMessage = () => {
    if (!message.trim() || !currentRoom || !isActive) return;

    stompClient.send(
      "/app/chat.sendMessage",
      {},
      JSON.stringify({
        roomId: currentRoom.id,
        userId: currentUserId,
        content: message,
      })
    );
    setMessage("");
  };

  const startPublishing = async () => {
    if (!device || !currentRoom || isOpenChat || !currentRoom.id) {
      console.error(
        "❌ [startPublishing] Invalid Room or Device not initialized!",
        { currentRoom }
      );
      return;
    }

    console.log(`📡 [startPublishing] 요청: Room ID=${currentRoom.id}`);

    socket.emit("createTransport", (data) => {
      const transport = device.createSendTransport(data);

      transport.on("connect", async ({ dtlsParameters }, callback, errback) => {
        if (transport.connected) {
          console.warn("⚠️ Transport already connected. Skipping connect.");
          return;
        }

        console.log("📡 Transport 연결 요청 중...");
        socket.emit(
          "connectTransport",
          { transportId: data.id, dtlsParameters },
          (response) => {
            if (response?.error) {
              console.error("❌ Transport 연결 실패:", response.error);
              return errback(response.error);
            }
            console.log("✅ Transport 연결 성공!");
            callback();
          }
        );
      });

      transport.on("produce", ({ kind, rtpParameters }, callback, errback) => {
        socket.emit(
          "produce",
          {
            roomId: String(currentRoom.id),
            transportId: data.id,
            kind,
            rtpParameters,
          },
          ({ id, error }) => {
            if (error) {
              console.error("❌ Producer 생성 실패:", error);
              return errback(error);
            }

            console.log(`✅ [produce] ${kind} Producer Created: ${id}`);
            callback({ id });

            if (kind === "video") setProducer(id);
          }
        );
      });

      setProducerTransport(transport);

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(async (stream) => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream; // ✅ `useRef`를 사용하여 안전하게 설정
          } else {
            console.error("❌ [startPublishing] localVideoRef is null!");
          }

          const videoTrack = stream.getVideoTracks()[0];
          await transport.produce({ track: videoTrack });
        })
        .catch(console.error);
    });
  };

  const startConsuming = async () => {
    if (!device || !currentRoom || isOpenChat || !currentRoom.id) {
      console.error(
        "❌ [startConsuming] Invalid Room or Device not initialized!"
      );
      return;
    }

    console.log(`📡 [getProducers] 요청: Room ID=${currentRoom.id}`);

    const producerIds = await new Promise((resolve) => {
      socket.emit("getProducers", { roomId: String(currentRoom.id) }, resolve);
    });

    console.log("📡 모든 Producer IDs:", producerIds);

    // ✅ 현재 사용자의 producer는 필터링하여 제외
    const filteredProducerIds = producerIds.filter((id) => id !== producer);
    console.log(
      "✅ 본인 Producer 제외 후, Consume할 Producer IDs:",
      filteredProducerIds
    );

    if (!filteredProducerIds || filteredProducerIds.length === 0) {
      console.warn(
        `⚠️ [getProducers] Room ${currentRoom.id} - 해당 방에서 Consume할 Producer가 없습니다.`
      );
      return;
    }

    socket.emit("createTransport", (data) => {
      const transport = device.createRecvTransport(data);

      transport.on("connect", async ({ dtlsParameters }, callback) => {
        socket.emit(
          "connectTransport",
          { transportId: data.id, dtlsParameters },
          callback
        );
      });

      setConsumerTransport(transport);

      filteredProducerIds.forEach((producerId) => {
        console.log(`🎥 [consume] 요청: Producer ID=${producerId}`);
        socket.emit(
          "consume",
          {
            roomId: String(currentRoom.id),
            transportId: data.id,
            producerId,
            rtpCapabilities: device.rtpCapabilities,
          },
          async (data) => {
            if (!data || data.error) {
              console.error("❌ [consume] ERROR:", data.error);
              return;
            }

            console.log("✅ [consume] 받은 데이터:", data);

            const consumer = await transport.consume({
              id: data.id,
              producerId: data.producerId,
              kind: data.kind,
              rtpParameters: data.rtpParameters,
            });

            setConsumer(consumer);
            const stream = new MediaStream();
            stream.addTrack(consumer.track);

            if (data.kind === "video") {
              console.log("📡 [consume] 비디오 스트림 설정");
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream; // ✅ 상대방 화면만 설정
              }
            }
          }
        );
      });
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          width: "900px",
          height: "600px",
          padding: "20px",
          background: "#fff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          borderRadius: "10px",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: "30%",
            borderRight: "1px solid #ddd",
            paddingRight: "10px",
          }}
        >
          <h3>My Chat Rooms</h3>
          <ul>
            {myRooms.map((room) => (
              <li
                key={room.roomId}
                onClick={() =>
                  fetchMessagesAndConnect(
                    room.roomId,
                    room.name,
                    room.isOpenChat
                  )
                }
              >
                {room.name}
              </li>
            ))}
          </ul>
          <button
            onClick={startPrivateChat}
            style={{
              marginTop: "10px",
              padding: "10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            Start Private Chat
          </button>
        </div>

        {/* Chat Section */}
        <div
          style={{
            width: "70%",
            paddingLeft: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "10px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <h3>
              {currentRoom ? `Chat Room: ${currentRoom.name}` : "Select a room"}
            </h3>
            {!isOpenChat && currentRoom && isActive && (
              <button
                onClick={leaveRoom}
                style={{
                  padding: "7px 12px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
              >
                Leave Room
              </button>
            )}
          </div>
          <div
            style={{
              flexGrow: 1,
              border: "1px solid #ddd",
              padding: "12px",
              overflowY: "auto",
              height: "400px",
              borderRadius: "5px",
              backgroundColor: "#fafafa",
            }}
          >
            {messages.map((msg, index) => (
              <div key={index}>
                <b>{msg.sender}:</b> {msg.content}
              </div>
            ))}
          </div>
          {/* ✅ 채팅 입력 부분 복구 ✅ */}
          <input
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
            type="text"
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
              marginTop: "5px",
            }}
            disabled={!currentRoom || !isActive}
          >
            Send Message
          </button>
        </div>
      </div>
      <div>
        <h1>Chat with Video</h1>

        {currentRoom && !isOpenChat && (
          <button
            onClick={toggleVideoStreaming}
            style={{
              padding: "10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            {isStreaming ? "📴 Stop Video" : "📡 Start/Watch Video"}
          </button>
        )}

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            width="320"
            height="180"
            style={{ border: "2px solid blue" }}
          />
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            width="320"
            height="180"
            style={{ border: "2px solid red" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat1;
