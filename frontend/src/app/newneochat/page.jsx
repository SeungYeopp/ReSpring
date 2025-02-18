"use client";

import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import io from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Video, Settings, ArrowLeft, Send } from "lucide-react"

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
  const currentRoomRef = useRef(null);

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
        setCurrentUserId(null);
      }
    };

    fetchUserSession();
  }, [currentUserId]);

  /* ✅ WebSocket 및 WebRTC 초기화 */
  /* ✅ WebSocket 및 WebRTC 초기화 */
  useEffect(() => {
    if (!currentUserId) return;

    console.log("-----------------------------", currentUserId);
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
  }, [currentUserId]);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (currentRoom) {
        console.log(
          `🚀 Leaving room ${currentRoom.id}. Updating last seen time...`
        );

        // ✅ 🔹 Redis에서 사용자 퇴장 처리
        await fetch(
          `${SERVER_URL}/room/leave?roomId=${currentRoom.id}&userId=${currentUserId}`,
          {
            method: "POST",
          }
        );
        await fetch(
          `${SERVER_URL}/last-seen?roomId=${currentRoom.id}&userId=${currentUserId}`,
          {
            method: "POST",
          }
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentRoom]);

  useEffect(() => {
    // currentRoom이 바뀔 때마다 ref를 최신으로 갱신
    currentRoomRef.current = currentRoom;
  }, [currentRoom]);

  // 컴포넌트가 언마운트되거나 페이지 이동될 때 실행
  useEffect(() => {
    return () => {
      // unmount 시점에 마지막에 설정된 currentRoomRef.current를 사용
      if (currentRoomRef.current) {
        const roomId = currentRoomRef.current.id;
        console.log("🚪 [Cleanup] leaving room on unmount:", roomId);

        // 1) REST 호출
        fetch(
          `${SERVER_URL}/room/leave?roomId=${roomId}&userId=${currentUserId}`,
          {
            method: "POST",
          }
        ).catch(console.error);

        // 2) STOMP 호출
        stompClient.send(
          "/app/chat.leaveRoom",
          {},
          JSON.stringify({
            roomId,
            userIds: [currentUserId],
            is_active: false,
          })
        );
      }
    };
  }, []);

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

  const handleRoomClick = async (newRoom) => {
    // 1) 만약 이미 접속 중인 방(currentRoom)이 있고, 그 방과 다른 방이면 leaveRoom API 호출
    if (currentRoom && currentRoom.id !== newRoom.roomId) {
      try {
        // 1-1) REST로 퇴장 처리
        await fetch(
          `${SERVER_URL}/room/leave?roomId=${currentRoom.id}&userId=${currentUserId}`,
          { method: "POST" }
        );

        // 1-2) STOMP send 로직이 있다면 여기서도 처리
        stompClient.send(
          "/app/chat.leaveRoom",
          {},
          JSON.stringify({
            roomId: currentRoom.id,
            userIds: [currentUserId],
            is_active: false,
          })
        );
        console.log(`✅ Left previous room: ${currentRoom.id}`);
      } catch (err) {
        console.error("❌ Failed to leave previous room:", err);
      }
    }

    // 2) 이제 새로운 방으로 이동
    fetchMessagesAndConnect(newRoom.roomId, newRoom.name, newRoom.isOpenChat);
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
      await fetch(
        `${SERVER_URL}/room/join?roomId=${roomId}&userId=${currentUserId}`,
        {
          method: "POST",
        }
      );
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
          `${SERVER_URL}/last-seen?roomId=${roomId}&userId=${currentUserId}`
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

  // --------------------------------------------------------------------------------------------------------------------------------------------------------
  const [activeScreen, setActiveScreen] = useState("rooms")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [fontSize, setFontSize] = useState("medium")
  const [letterSpacing, setLetterSpacing] = useState("normal")
  const [fontFamily, setFontFamily] = useState("sans")
  const [isVideoPopoverOpen, setIsVideoPopoverOpen] = useState(false)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]) //Corrected dependency

  const fontSizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  }

  const letterSpacings = {
    tight: "tracking-tight",
    normal: "tracking-normal",
    wide: "tracking-wide",
  }

  const fontFamilies = {
    sans: "font-sans",
    serif: "font-serif",
    mono: "font-mono",
  }

  const renderRoomList = () => (
    <Card className={`flex flex-col h-full ${fontFamilies[fontFamily]}`}>
      <CardHeader>
        <CardTitle className={`${fontSizes[fontSize]} ${letterSpacings[letterSpacing]}`}>Chat Rooms</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-2 p-4">
            {myRooms.map((room) => (
              <Button
                key={room.roomId}
                variant={currentRoom?.roomId === room.roomId ? "secondary" : "ghost"}
                className={`w-full justify-start ${fontSizes[fontSize]} ${letterSpacings[letterSpacing]}`}
                onClick={() => {
                  handleRoomClick(room)
                  setActiveScreen("chat")
                }}
              >
                {room.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <div className="p-4 border-t">
        <Button onClick={startPrivateChat} className={`w-full ${fontSizes[fontSize]} ${letterSpacings[letterSpacing]}`}>
          Start Private Chat
        </Button>
      </div>
    </Card>
  )

  const renderVideoPopover = () => (
    <Card className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <CardContent className="bg-background p-6 rounded-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <CardTitle className={`${fontSizes[fontSize]} ${letterSpacings[letterSpacing]}`}>Video Chat</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsVideoPopoverOpen(false)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative aspect-video">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-lg" />
            <p
              className={`absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded ${fontSizes[fontSize]} ${letterSpacings[letterSpacing]}`}
            >
              You
            </p>
          </div>
          <div className="relative aspect-video">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover rounded-lg" />
            <p
              className={`absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded ${fontSizes[fontSize]} ${letterSpacings[letterSpacing]}`}
            >
              Remote
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <Button
            onClick={toggleVideoStreaming}
            variant={isStreaming ? "destructive" : "default"}
            className={`${fontSizes[fontSize]} ${letterSpacings[letterSpacing]}`}
          >
            {isStreaming ? "End Video Chat" : "Start Video Chat"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderChatScreen = () => (
    <Card className={`flex flex-col h-full ${fontFamilies[fontFamily]}`}>
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={() => setActiveScreen("rooms")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${currentRoom?.name}`} />
            <AvatarFallback>{currentRoom?.name?.[0]}</AvatarFallback>
          </Avatar>
          <CardTitle className={`${fontSizes[fontSize]} ${letterSpacings[letterSpacing]}`}>
            {currentRoom ? currentRoom.name : "Select a room"}
          </CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          {currentRoom && !isOpenChat && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVideoPopoverOpen(true)}
              className={isStreaming ? "text-red-500 hover:text-red-600" : ""}
            >
              <Video className="h-4 w-4" />
            </Button>
          )}
          {!isOpenChat && currentRoom && isActive && (
            <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      leaveRoom()
                      setActiveScreen("rooms")
                      setIsSettingsOpen(false)
                    }}
                  >
                    Leave Room
                  </Button>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Font Size</p>
                    <Select value={fontSize} onValueChange={setFontSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Letter Spacing</p>
                    <Select value={letterSpacing} onValueChange={setLetterSpacing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tight">Tight</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="wide">Wide</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Font Family</p>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sans">Sans-serif</SelectItem>
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="mono">Monospace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-4 p-4">
          {messages.map((msg, index) => (
  <div 
    key={index} 
    className={`flex flex-col ${msg.sender === currentUserId ? "items-end" : "items-start"}`}
  >
    <span className="text-sm text-muted-foreground mb-1">
      {msg.sender === currentUserId ? "Me" : userNickname}
    </span>
    <div
      className={`max-w-[75%] px-4 py-2 rounded-lg
      ${msg.sender === currentUserId ? "bg-primary text-primary-foreground" : "bg-muted"}
      ${fontSizes[fontSize]} ${letterSpacings[letterSpacing]}`}
    >
      {msg.content}
    </div>
  </div>
))}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
          className="flex items-center space-x-2"
        >
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className={`flex-1 ${fontSizes[fontSize]} ${letterSpacings[letterSpacing]}`}
          />
          <Button type="submit" size="icon" disabled={!currentRoom || !isActive}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  )

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] w-full">
      <div className="h-full overflow-hidden">
        {activeScreen === "rooms" && renderRoomList()}
        {activeScreen === "chat" && renderChatScreen()}
        {isVideoPopoverOpen && renderVideoPopover()}
      </div>
    </div>
  )
}
export default Chat1;
