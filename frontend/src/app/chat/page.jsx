"use client";

import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
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
import { Sprout, Video, Settings, ArrowLeft, Send, Users, MessageSquarePlus, Eye, EyeOff } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { useSearchParams, useRouter } from 'next/navigation';
import { getUserInfoByNickname, UserInfo } from "@/lib/api/user";

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
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);


  // 모달열리면 요청할 것
  const [subscribedUsers, setSubscribedUsers] = useState([]);
  const fetchSubscribedUsers = async () => {
    try {
      // 서버가 요구하는 엔드포인트로 변경
      const response = await fetch(
        "http://localhost:8080/subscriptions/me/users",
        { credentials: "include" }
      );

      if (!response.ok) throw new Error("구독한 사용자 목록 불러오기 실패!");

      const data = await response.json();
      // createdAt 필드를 Date 객체로 변환하는 처리 추가
      const formattedData = data.map((subscriber) => ({
        ...subscriber,
        createdAt: new Date(subscriber.createdAt),
      }));
      setSubscribedUsers(formattedData);
    } catch (error) {
      console.error("❌ 구독 사용자 가져오는 중 오류 발생:", error);
    }
  };



  // 프로필 화면서 접근시
  const searchParams = useSearchParams();
  const targetNickname = searchParams.get("targetNickname");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    if (!targetNickname) return;

    const fetchUserInfo = async () => {
      try {
        console.log("Fetching user info for nickname:", targetNickname);
        const userInfo = await getUserInfoByNickname(targetNickname);
        
        console.log("Fetched user info:", userInfo);
        
        // Set the userId state
        setUserId(userInfo.userId);
      } catch (error) {
        console.error("Failed to fetch user info:", error.message);
      } finally {
        setLoading(false);  // Once fetching is done, set loading to false
      }
    };

    fetchUserInfo();
  }, [targetNickname]);

  // Ensure startPrivateChat is called only when userId is set and loading is complete
  useLayoutEffect(() => {
    if (!loading && userId) {
      console.log("Starting private chat with userId:", userId);
      startPrivateChat(userId);
    }
  }, [userId, loading]);  // Dependency on both userId and loading




  // 모달이 열릴 때 fetch 실행되게!
  useEffect(() => {
    if (isNewChatOpen) {
      fetchSubscribedUsers();
    }
  }, [isNewChatOpen]);

  // 추가: 모달 외에도 컴포넌트가 마운트될 때 구독자 목록을 미리 로드
  useEffect(() => {
    fetchSubscribedUsers();
  }, []);

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
  // 모달 관련 상태 추가
  const [searchQuery, setSearchQuery] = useState("");
  // 검색어에 따라 필터링된 사용자 목록 생성
  const filteredUsers = subscribedUsers.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.userNickname.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

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
    const rooms = JSON.parse(message.body);
    console.log("현재 방 목록:", rooms); // ✅ 여기 추가
    setMyRooms(rooms);
  };


  const getProfileImageForRoom = (room) => {
    // 오픈채팅인 경우 Dicebear 이미지를 그대로 사용
    if (room.isOpenChat) {
      return `https://api.dicebear.com/6.x/initials/svg?seed=${room.name}`;
    }

    // 1:1 채팅인 경우, 상대방의 이름 추출 (ex: "Private Chat: A & B"에서 내 이름이 userNickname일 때 상대방 이름)
    const otherName = extractOtherUserName(room.name, userNickname);
    // 구독한 사용자 목록에서 일치하는 사용자 찾기
    const foundUser = subscribedUsers.find(
      (user) => user.userNickname === otherName
    );
    // 찾으면 프로필 이미지 URL 반환, 없으면 기본 Dicebear 이미지 반환
    return foundUser?.profileImage || `https://api.dicebear.com/6.x/initials/svg?seed=${room.name}`;
  };

  // 챌린지 상세에 있는 roomId랑 비교해서 같은 방 컨텐츠를 렌더링 하는 방식으로 하자. 디자인도 여기 있는 거 그대로 쓰고.
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

  // const startPrivateChat = () => {
  //   const selectedUserId = prompt("Enter User ID to start a private chat:");
  //   if (!selectedUserId) return;

  //   stompClient.send(
  //     "/app/chat.private",
  //     {},
  //     JSON.stringify({
  //       user1: currentUserId,
  //       user2: selectedUserId,
  //     })
  //   );

  //   stompClient.subscribe(`/topic/newRoom/${currentUserId}`, (message) => {
  //     const privateRoom = JSON.parse(message.body);
  //     fetchMessagesAndConnect(privateRoom.roomId, privateRoom.name, false);

  //     // ✅ 1:1 채팅 생성 후 즉시 내 방 목록 새로고침
  //     stompClient.send("/app/chat/myRooms/" + currentUserId, {}, {});
  //   });
  // };
  // 기존의 prompt 방식 대신 모달 입력값을 사용하도록 수정
  const startPrivateChat = (selectedUserId) => {
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
      // 1:1 채팅 생성 후 즉시 내 방 목록 새로고침
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
  // 초기 상태 변경: 기본 폰트를 "binggraetaom" 등 원하는 키로 설정합니다.
  const [activeScreen, setActiveScreen] = useState("rooms");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [fontSize, setFontSize] = useState("medium");
  const [letterSpacing, setLetterSpacing] = useState("normal");
  const [fontFamily, setFontFamily] = useState("binggraetaom");
  const [isVideoPopoverOpen, setIsVideoPopoverOpen] = useState(false);
  // const [showOpenChats, setShowOpenChats] = useState(true);
  const [showOpenChats, setShowOpenChats] = useState(false);

  const [newChatUserId, setNewChatUserId] = useState("");

  // 글꼴 매핑을 Tailwind 설정의 fontFamily 키와 클래스 이름으로 변경합니다.
  const fontFamilies = {
    godob: "font-godob",
    godom: "font-godom",
    godomaum: "font-godomaum",
    nunugothic: "font-nunugothic",
    samlipbasic: "font-samlipbasic",
    samlipoutline: "font-samlipoutline",
    ongle: "font-ongle",
    binggraetaom: "font-binggraetaom",
    binggraetaombold: "font-binggraetaombold",
    mapobackpacking: "font-mapobackpacking",
    goodneighborsbold: "font-goodneighborsbold",
    goodneighborsregular: "font-goodneighborsregular",
    laundrygothicbold: "font-laundrygothicbold",
    laundrygothicregular: "font-laundrygothicregular",
    handon300: "font-handon300",
    handon600: "font-handon600",
  };

  const extractOtherUserName = (roomName, myNickname) => {
    if (roomName.startsWith("Private Chat: ")) {
      const namesPart = roomName.replace("Private Chat: ", "");
      const names = namesPart.split(" & ");
      return names.find((name) => name.trim() !== myNickname) || "알 수 없음";
    }
    return roomName;
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // useEffect dependency 수정

  const handleStartPrivateChat = () => {
    if (newChatUserId.trim()) {
      startPrivateChat(newChatUserId);
      setNewChatUserId("");
      setIsNewChatOpen(false);
    }
  };

  const fontSizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const letterSpacings = {
    tight: "tracking-tight",
    normal: "tracking-normal",
    wide: "tracking-wide",
  };

  // const filteredRooms = showOpenChats ? myRooms : myRooms.filter((room) => !room.isOpenChat);
  const filteredRooms = myRooms.filter((room) => !room.isOpenChat);

  const renderRoomList = () => (
    <Card className={`flex flex-col h-full ${fontFamilies[fontFamily]} border-none bg-white/50 backdrop-blur-sm shadow-lg`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sprout className="text-[#96b23c] w-5 h-5" />
            <CardTitle className={`${fontSizes[fontSize]} ${letterSpacings[letterSpacing]} text-gray-900`}>
              채팅방 목록
            </CardTitle>
          </div>
          <Button
            onClick={() => setIsNewChatOpen(true)}
            variant="outline"
            size="sm"
            className={`${fontSizes[fontSize]} ${letterSpacings[letterSpacing]} border-[#96b23c] text-[#96b23c] hover:bg-[#e6f3d4] transition-all duration-300 hover:scale-105`}
          >
            새 채팅
          </Button>
        </div>
        {/* <div className="flex items-center space-x-2 mt-2">
          <Switch
            checked={showOpenChats}
            onCheckedChange={setShowOpenChats}
            id="open-chat-mode"
            className="data-[state=checked]:bg-[#96b23c]"
          />
          <label htmlFor="open-chat-mode" className="text-sm font-medium text-gray-700">
            {showOpenChats ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {showOpenChats ? "오픈채팅 보기" : "오픈채팅 숨기기"}
          </label>
        </div> */}
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-2 p-4">
            {filteredRooms.map((room) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={room.roomId}
                className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105
                   ${currentRoom?.roomId === room.roomId ? "bg-[#96b23c] text-white" : "hover:bg-[#e6f3d4]"}
                   ${fontSizes[fontSize]} ${letterSpacings[letterSpacing]}`}
                onClick={() => {
                  handleRoomClick(room);
                  setActiveScreen("chat");
                }}
              >
                <Avatar className="border-2 border-white shadow-sm">
                  <AvatarImage src={getProfileImageForRoom(room)} />
                  <AvatarFallback>{room.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${currentRoom?.roomId === room.roomId ? "text-white" : "text-gray-900"
                      }`}
                  >
                    {room.isOpenChat ? room.name : extractOtherUserName(room.name, userNickname)}
                  </p>
                  {room.isOpenChat && (
                    <div
                      className={`flex items-center text-xs ${currentRoom?.roomId === room.roomId ? "text-white/80" : "text-gray-500"
                        }`}
                    >
                      <Users className="w-3 h-3 mr-1" />
                      <span>{room.userCount || 0}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  const renderEmptyChatScreen = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <Sprout className="text-[#96b23c] w-12 h-12 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">시작하기</h3>
        <p className="text-sm text-gray-700 mb-6">채팅방을 선택하거나 새로운 채팅을 시작하세요.</p>
        <Button
          onClick={() => setIsNewChatOpen(true)}
          variant="outline"
          className="px-6 py-2 text-sm rounded-full border-[#96b23c] text-[#96b23c] hover:bg-[#e6f3d4] transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg font-semibold"
        >
          새 채팅
        </Button>
      </motion.div>
    </div>
  );

  const renderVideoPopover = () => (
    <Card className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <CardContent className="bg-white/95 p-6 rounded-2xl max-w-2xl w-full shadow-lg border-none">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Video className="text-[#96b23c] w-5 h-5" />
            <CardTitle className={`${fontSizes[fontSize]} ${letterSpacings[letterSpacing]} text-gray-900`}>
              Video Chat
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVideoPopoverOpen(false)}
            className="hover:bg-[#e6f3d4] text-[#96b23c]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <p className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">You</p>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <p className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">Remote</p>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <Button
            onClick={toggleVideoStreaming}
            variant={isStreaming ? "destructive" : "default"}
            className={`${isStreaming ? "bg-red-500 hover:bg-red-600" : "bg-[#96b23c] hover:bg-[#7a9431]"
              } text-white transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg`}
          >
            {isStreaming ? "End Video Chat" : "Start Video Chat"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderChatScreen = () => (
    <Card className={`flex flex-col h-full ${fontFamilies[fontFamily]} border-none pb-10 mb-5 bg-white/50 backdrop-blur-sm shadow-lg`}>
      <CardHeader className="flex flex-row items-center justify-between py-2 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveScreen("rooms")}
            className="md:hidden hover:bg-[#e6f3d4] text-[#96b23c]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {/* currentRoom이 존재할 때만 Avatar 렌더링 */}
          {currentRoom && (
            <Avatar className="border-2 border-white shadow-sm">
              <AvatarImage src={getProfileImageForRoom(currentRoom)} />
              <AvatarFallback>
                {currentRoom.isOpenChat
                  ? currentRoom.name?.[0]
                  : (extractOtherUserName(currentRoom.name, userNickname)?.charAt(0) || "U")}
              </AvatarFallback>
            </Avatar>
          )}
          <CardTitle className={`${fontSizes[fontSize]} ${letterSpacings[letterSpacing]} text-gray-900`}>
            {currentRoom
              ? currentRoom.isOpenChat
                ? currentRoom.name
                : extractOtherUserName(currentRoom.name, userNickname)
              : ""}
          </CardTitle>
        </div>

        <div className="flex items-center space-x-2">
          {currentRoom && !isOpenChat && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVideoPopoverOpen(true)}
              className={`hover:bg-[#e6f3d4] ${isStreaming ? "text-red-500" : "text-[#96b23c]"}`}
            >
              <Video className="h-4 w-4" />
            </Button>
          )}
          {!isOpenChat && currentRoom && isActive && (
            <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-[#e6f3d4] text-[#96b23c]">
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 border-none bg-white/95 backdrop-blur-sm shadow-lg">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">글씨체</p>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger className="border-[#96b23c] text-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="godob">고도 B</SelectItem>
                      <SelectItem value="godom">고도 M</SelectItem>
                      <SelectItem value="godomaum">고도 마음체</SelectItem>
                      <SelectItem value="nunugothic">누누 기본 고딕체</SelectItem>
                      <SelectItem value="samlipbasic">삼립호빵 베이직</SelectItem>
                      <SelectItem value="samlipoutline">삼립호빵 아웃라인</SelectItem>
                      <SelectItem value="ongle">온글잎 박다현체</SelectItem>
                      <SelectItem value="binggraetaom">빙그레 타옴</SelectItem>
                      <SelectItem value="binggraetaombold">빙그레 타옴 볼드</SelectItem>
                      <SelectItem value="mapobackpacking">마포 백패킹</SelectItem>
                      <SelectItem value="goodneighborsbold">굿네이버스 좋은이웃체 (볼드)</SelectItem>
                      <SelectItem value="goodneighborsregular">굿네이버스 좋은이웃체 (레귤러)</SelectItem>
                      <SelectItem value="laundrygothicbold">런드리고딕 볼드</SelectItem>
                      <SelectItem value="laundrygothicregular">런드리고딕 레귤러</SelectItem>
                      <SelectItem value="handon300">한돈 삼겹살체 (300g)</SelectItem>
                      <SelectItem value="handon600">한돈 삼겹살체 (600g)</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">글자 크기</p>
                    <Select value={fontSize} onValueChange={setFontSize}>
                      <SelectTrigger className="border-[#96b23c] text-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">작게</SelectItem>
                        <SelectItem value="medium">보통</SelectItem>
                        <SelectItem value="large">크게</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">자간</p>
                    <Select value={letterSpacing} onValueChange={setLetterSpacing}>
                      <SelectTrigger className="border-[#96b23c] text-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tight">좁게</SelectItem>
                        <SelectItem value="normal">보통</SelectItem>
                        <SelectItem value="wide">넓게</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start bg-red-600 hover:bg-[#ff4141] text-white"
                      onClick={() => {
                        leaveRoom();
                        setActiveScreen("rooms");
                        setIsSettingsOpen(false);
                      }}
                    >
                      채팅 나가기
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardHeader>
      {currentRoom ? (
        <>
          <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1">
              <div className="flex flex-col space-y-4 p-4">
                {messages.map((msg, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={index}
                    className={`flex ${msg.sender === currentUserId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm
                        ${msg.sender === currentUserId ? "bg-[#96b23c] text-white" : "bg-white text-gray-900"}
                        ${fontSizes[fontSize]} ${letterSpacings[letterSpacing]}`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <div className="p-4 pb-0 border-t border-gray-100 mt-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className={`flex-1 border-[#96b23c] focus-visible:ring-[#96b23c] ${fontSizes[fontSize]} ${letterSpacings[letterSpacing]}`}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!currentRoom || !isActive}
                className="bg-[#96b23c] hover:bg-[#7a9431] text-white transition-all duration-300 hover:scale-105"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      ) : (
        renderEmptyChatScreen()
      )}
    </Card>
  );

  return (
    <div className="h-screen w-full bg-gradient-to-b from-[#e6f3d4] to-[#fce8e8] overflow-hidden">
      <div className="h-full overflow-hidden md:grid md:grid-cols-[300px_1fr] md:gap-4 p-4 pb-0">
        <div className={`h-full ${activeScreen === "chat" ? "hidden md:block" : ""}`}>{renderRoomList()}</div>
        <div className={`h-full ${activeScreen === "rooms" ? "hidden md:block" : ""}`}>{renderChatScreen()}</div>
        {isVideoPopoverOpen && renderVideoPopover()}
      </div>
      <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-none shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-900">새 채팅 시작하기</DialogTitle>
            <DialogDescription className="text-gray-700">
              이야기를 나누고 싶은 사람을 선택하세요.
            </DialogDescription>
          </DialogHeader>

          {/* 검색 입력 필드 추가 */}
          <div className="px-4 pb-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="닉네임 또는 이메일 검색..."
              className="border-[#96b23c] focus-visible:ring-[#96b23c]"
            />
          </div>

          {/* ✅ 구독한 사용자 목록 표시 */}
          <div className="grid gap-4 py-4 max-h-60 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    startPrivateChat(user.id);
                    setIsNewChatOpen(false); // 선택 후 모달 닫기
                  }}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-[#e6f3d4] transition"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.profileImage} />
                    <AvatarFallback>{user.userNickname ? user.userNickname[0] : "U"}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{user.userNickname}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">검색 결과가 없습니다.</p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewChatOpen(false)}
              className="border-[#96b23c] text-[#96b23c] hover:bg-[#e6f3d4]"
            >
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>

      </Dialog>

    </div>
  );
};

export default Chat1;
