"use client";

import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import io from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bean, Flower2, Sprout, Video, Settings, ArrowLeft, Send, Users, Eye, EyeOff, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { getUserInfoByNickname } from "@/lib/api/user";
import { usePathname } from "next/navigation";
import Link from "next/link";

// DEBUG 플래그: true이면 추가 디버깅 로그 출력
const DEBUG = true;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:4000";

const SERVER_URL = `${API_BASE_URL}/chat`;
const USER_SESSION_URL = `${API_BASE_URL}/user/me`;

const debugLog = (...args) => {
  if (DEBUG) console.log(...args);
};

const Chat1 = () => {
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
  const [subscribedUsers, setSubscribedUsers] = useState([]);

  const fetchSubscribedUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/subscriptions/me/users`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("구독한 사용자 목록 불러오기 실패!");
      const data = await response.json();
      const formattedData = data.map((subscriber) => ({
        ...subscriber,
        createdAt: new Date(subscriber.createdAt),
      }));
      setSubscribedUsers(formattedData);
    } catch (error) {
      console.error("❌ 구독 사용자 가져오기 오류:", error);
    }
  };

  const searchParams = useSearchParams();
  const targetNickname = searchParams.get("targetNickname");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    if (!targetNickname) return;
    const fetchUserInfo = async () => {
      try {
        debugLog("Fetching user info for:", targetNickname);
        const userInfo = await getUserInfoByNickname(targetNickname);
        setUserId(userInfo.userId);
      } catch (error) {
        console.error("❌ 사용자 정보 가져오기 실패:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [targetNickname]);

  useLayoutEffect(() => {
    if (!loading && userId) {
      debugLog("Starting private chat with userId:", userId);
      startPrivateChat(userId);
    }
  }, [userId, loading]);

  useEffect(() => {
    if (isNewChatOpen) fetchSubscribedUsers();
  }, [isNewChatOpen]);

  useEffect(() => {
    fetchSubscribedUsers();
  }, []);

  // WebRTC 상태
  const [socket, setSocket] = useState(null);
  const [device, setDevice] = useState(null);
  const [producerTransport, setProducerTransport] = useState(null);
  const [consumerTransport, setConsumerTransport] = useState(null);
  const [producer, setProducer] = useState(null);
  const [consumer, setConsumer] = useState(null);
  const [isProducing, setIsProducing] = useState(false);
  const [isConsuming, setIsConsuming] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredUsers = subscribedUsers.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.userNickname.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  // 로그인 사용자 정보
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userNickname, setUserNickname] = useState("");
  const currentRoomRef = useRef(null);

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await fetch(USER_SESSION_URL, { credentials: "include" });
        if (!response.ok) throw new Error("세션 정보 불러오기 실패");
        const data = await response.json();
        setCurrentUserId(data.userId);
        setUserNickname(data.userNickname);
        debugLog("로그인 사용자:", data.userNickname);
      } catch (error) {
        console.error("❌ 사용자 세션 오류:", error);
        setCurrentUserId(null);
      }
    };
    fetchUserSession();
  }, [currentUserId]);

  // WebSocket 및 WebRTC 초기화
  useEffect(() => {
    if (!currentUserId) return;
    const sock = new SockJS(SERVER_URL);
    const client = Stomp.over(sock);
    const rtcSock = io("wss://i12a307.p.ssafy.io/socket.io/", {
      transports: ["websocket"],
    });
  
    // 연결 확인 로그 추가
    rtcSock.on("connect", () => {
      console.log("Socket.io connected on rtcSock");
      // getRouterRtpCapabilities 이벤트를 서버에 요청합니다.
      rtcSock.emit("getRouterRtpCapabilities", async (rtpCapabilities) => {
        console.log("Received rtpCapabilities:", rtpCapabilities);
        if (rtpCapabilities.error) {
          console.error("❌ getRouterRtpCapabilities 오류:", rtpCapabilities.error);
          return;
        }
        try {
          const newDevice = new mediasoupClient.Device();
          await newDevice.load({ routerRtpCapabilities: rtpCapabilities });
          console.log("Device successfully loaded");
          setDevice(newDevice);
        } catch (error) {
          console.error("❌ Device 초기화 오류:", error);
        }
      });
    });
  
    client.connect({}, () => {
      client.subscribe(`/topic/chat/myRooms/${currentUserId}`, updateMyRooms);
      client.subscribe(`/topic/chat/roomUpdated/${currentUserId}`, () => {
        client.send("/app/chat/myRooms/" + currentUserId, {}, {});
      });
      client.send("/app/chat/myRooms/" + currentUserId, {}, {});
    });
    setStompClient(client);
    setSocket(rtcSock);
  
    return () => {
      client.disconnect();
      rtcSock.disconnect();
    };
  }, [currentUserId]);
  

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (currentRoom) {
        try {
          await fetch(`${SERVER_URL}/room/leave?roomId=${currentRoom.id}&userId=${currentUserId}`, { method: "POST" });
          await fetch(`${SERVER_URL}/last-seen?roomId=${currentRoom.id}&userId=${currentUserId}`, { method: "POST" });
        } catch (error) {
          console.error("❌ beforeunload 오류:", error);
        }
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentRoom]);

  useEffect(() => {
    currentRoomRef.current = currentRoom;
  }, [currentRoom]);

  // 방어 코드 최적화 (컴포넌트 언마운트 시 처리)
  useEffect(() => {
    const abortController = new AbortController();
    return () => {
      if (currentRoomRef.current && stompClient) {
        const roomId = currentRoomRef.current.id;
        fetch(`${SERVER_URL}/room/leave?roomId=${roomId}&userId=${currentUserId}`, {
          method: "POST",
          signal: abortController.signal,
        }).catch((err) => {
          if (err.name !== "AbortError") console.error(err);
        });
        try {
          stompClient.send(
            "/app/chat.leaveRoom",
            {},
            JSON.stringify({ roomId, userIds: [currentUserId], is_active: false })
          );
        } catch (error) {
          console.error("STOMP 종료 오류:", error);
        }
      }
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (!socket || !currentRoom) return;
    const handleStopStreaming = ({ roomId }) => {
      if (currentRoom.id === roomId) {
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
    return () => socket.off("stopStreaming", handleStopStreaming);
  }, [socket, currentRoom]);

  useEffect(() => {
    if (!socket || !currentRoom) return;
    const handleNewProducerConsume = async ({ producerId, roomId }) => {
      socket.emit("createTransport", (data) => {
        const transport = device.createRecvTransport(data);
        transport.on("connect", async ({ dtlsParameters }, callback) => {
          socket.emit("connectTransport", { transportId: data.id, dtlsParameters }, callback);
        });
        setConsumerTransport(transport);
        socket.emit(
          "consume",
          {
            roomId: String(roomId),
            transportId: data.id,
            producerId,
            rtpCapabilities: device.rtpCapabilities,
          },
          async (response) => {
            if (!response || response.error) {
              console.error("❌ [consume] 오류:", response?.error);
              return;
            }
            try {
              const consumer = await transport.consume({
                id: response.id,
                producerId: response.producerId,
                kind: response.kind,
                rtpParameters: response.rtpParameters,
              });
              setConsumer(consumer);
              const stream = new MediaStream();
              stream.addTrack(consumer.track);
              if (response.kind === "video" && remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream;
              }
            } catch (error) {
              console.error("❌ Consumer 생성 오류:", error);
            }
          }
        );
      });
    };
    socket.on("triggerConsumeNew", handleNewProducerConsume);
    return () => socket.off("triggerConsumeNew", handleNewProducerConsume);
  }, [socket, currentRoom, device]);

  useEffect(() => {
    if (!socket || !currentRoom) return;
    socket.emit("joinRoom", { roomId: currentRoom.id });
    return () => socket.emit("leaveRoom", { roomId: currentRoom.id });
  }, [socket, currentRoom]);

  const toggleVideoStreaming = async () => {
    if (!device || !currentRoom || isOpenChat || !currentRoom.id) {
      console.error("❌ Room 또는 Device 초기화 오류");
      return;
    }
    if (isStreaming) {
      stopVideoStreaming();
      setIsStreaming(false);
      setIsProducing(false);
      return;
    }
    try {
      const producerIds = await new Promise((resolve) => {
        socket.emit("getProducers", { roomId: String(currentRoom.id) }, resolve);
      });
      if (producerIds.length > 0) {
        await startConsuming(producerIds);
        setIsConsuming(true);
        await startPublishing();
        setIsProducing(true);
        socket.emit("triggerConsume", { roomId: currentRoom.id });
      } else {
        await startPublishing();
        setIsProducing(true);
      }
      setIsStreaming(true);
    } catch (error) {
      console.error("❌ toggleVideoStreaming 오류:", error);
    }
  };

  const handleRoomClick = async (newRoom) => {
    if (currentRoom && currentRoom.id !== newRoom.roomId) {
      try {
        await fetch(`${SERVER_URL}/room/leave?roomId=${currentRoom.id}&userId=${currentUserId}`, {
          method: "POST",
        });
        stompClient.send(
          "/app/chat.leaveRoom",
          {},
          JSON.stringify({ roomId: currentRoom.id, userIds: [currentUserId], is_active: false })
        );
      } catch (err) {
        console.error("❌ 이전 방 퇴장 오류:", err);
      }
    }
    fetchMessagesAndConnect(newRoom.roomId, newRoom.name, newRoom.isOpenChat);
  };

  const stopVideoStreaming = () => {
    if (producer && typeof producer.close === "function") {
      producer.close();
      setProducer(null);
    } else {
      console.warn("⚠️ Producer 이미 종료됨 또는 존재하지 않음");
    }
    socket.emit("stopStreaming", { roomId: currentRoom.id });
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      let stream = localVideoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setIsProducing(false);
  };

  const updateMyRooms = (message) => {
    try {
      const rooms = JSON.parse(message.body);
      setMyRooms(rooms);
    } catch (error) {
      console.error("❌ updateMyRooms 파싱 오류:", error);
    }
  };

  const getProfileImageForRoom = (room) => {
    if (room.isOpenChat) {
      return `https://api.dicebear.com/6.x/initials/svg?seed=${room.name}`;
    }
    const otherName = extractOtherUserName(room.name, userNickname);
    const foundUser = subscribedUsers.find((user) => user.userNickname === otherName);
    return foundUser?.profileImage || `https://api.dicebear.com/6.x/initials/svg?seed=${room.name}`;
  };

  const fetchMessagesAndConnect = async (roomId, roomName, openChat) => {
    if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
    setCurrentRoom({ id: roomId, name: roomName, isOpenChat: openChat });
    setIsOpenChat(openChat);
    setIsActive(true);
    try {
      await fetch(`${SERVER_URL}/room/join?roomId=${roomId}&userId=${currentUserId}`, {
        method: "POST",
      });
      const response = await fetch(`${SERVER_URL}/messages/${roomId}`);
      if (!response.ok) throw new Error(`메시지 불러오기 실패 (Status: ${response.status})`);
      const chatMessages = await response.json();
      let lastSeenTime = 0;
      try {
        const lastSeenResponse = await fetch(`${SERVER_URL}/last-seen?roomId=${roomId}&userId=${currentUserId}`);
        if (lastSeenResponse.ok) {
          lastSeenTime = await lastSeenResponse.json();
        }
      } catch (err) {
        console.warn("⚠️ 마지막 접속 시간 불러오기 오류:", err);
      }
      const processedMessages = chatMessages.map((msg) => ({
        ...msg,
        isRead: new Date(msg.timestamp).getTime() <= lastSeenTime,
      }));
      setMessages(processedMessages);
    } catch (error) {
      console.error("❌ 메시지 불러오기 오류:", error);
    }
    subscriptionRef.current = stompClient.subscribe(`/topic/messages/${roomId}`, (msg) => {
      try {
        const newMessage = JSON.parse(msg.body);
        setMessages((prev) => [...prev, newMessage]);
      } catch (error) {
        console.error("❌ 메시지 구독 파싱 오류:", error);
      }
    });
  };

  const startPrivateChat = (selectedUserId) => {
    if (!selectedUserId) return;
    if (!currentUserId) {
      setTimeout(() => startPrivateChat(selectedUserId), 500);
      return;
    }
    if (stompClient && stompClient.connected) {
      stompClient.send(
        "/app/chat.private",
        {},
        JSON.stringify({ user1: currentUserId, user2: selectedUserId })
      );
      stompClient.subscribe(`/topic/newRoom/${currentUserId}`, (message) => {
        try {
          const privateRoom = JSON.parse(message.body);
          fetchMessagesAndConnect(privateRoom.roomId, privateRoom.name, false);
          stompClient.send("/app/chat/myRooms/" + currentUserId, {}, {});
        } catch (error) {
          console.error("❌ privateChat 파싱 오류:", error);
        }
      });
    } else {
      setTimeout(() => startPrivateChat(selectedUserId), 500);
    }
  };

  const sendMessage = () => {
    if (!message.trim() || !currentRoom || !isActive) return;
    stompClient.send(
      "/app/chat.sendMessage",
      {},
      JSON.stringify({ roomId: currentRoom.id, userId: currentUserId, content: message })
    );
    setMessage("");
  };

  const startPublishing = async () => {
    if (!device || !currentRoom || isOpenChat || !currentRoom.id) {
      console.error("❌ [startPublishing] Room 또는 Device 초기화 오류", { currentRoom });
      return;
    }
    socket.emit("createTransport", (data) => {
      const transport = device.createSendTransport(data);
      transport.on("connect", async ({ dtlsParameters }, callback, errback) => {
        if (transport.connected) {
          return;
        }
        socket.emit("connectTransport", { transportId: data.id, dtlsParameters }, (response) => {
          if (response?.error) {
            return errback(response.error);
          }
          callback();
        });
      });
      transport.on("produce", ({ kind, rtpParameters }, callback, errback) => {
        socket.emit(
          "produce",
          { roomId: String(currentRoom.id), transportId: data.id, kind, rtpParameters },
          ({ id, error }) => {
            if (error) {
              return errback(error);
            }
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
            localVideoRef.current.srcObject = stream;
          }
          const videoTrack = stream.getVideoTracks()[0];
          await transport.produce({ track: videoTrack });
        })
        .catch((error) => console.error("❌ getUserMedia 오류:", error));
    });
  };

  const startConsuming = async () => {
    if (!device || !currentRoom || isOpenChat || !currentRoom.id) {
      console.error("❌ [startConsuming] Room 또는 Device 초기화 오류");
      return;
    }
    const producerIds = await new Promise((resolve) => {
      socket.emit("getProducers", { roomId: String(currentRoom.id) }, resolve);
    });
    const filteredProducerIds = producerIds.filter((id) => id !== producer);
    if (!filteredProducerIds || filteredProducerIds.length === 0) {
      return;
    }
    socket.emit("createTransport", (data) => {
      const transport = device.createRecvTransport(data);
      transport.on("connect", async ({ dtlsParameters }, callback) => {
        socket.emit("connectTransport", { transportId: data.id, dtlsParameters }, callback);
      });
      setConsumerTransport(transport);
      filteredProducerIds.forEach((producerId) => {
        socket.emit(
          "consume",
          { roomId: String(currentRoom.id), transportId: data.id, producerId, rtpCapabilities: device.rtpCapabilities },
          async (response) => {
            if (!response || response.error) {
              console.error("❌ [consume] 오류:", response?.error);
              return;
            }
            try {
              const consumer = await transport.consume({
                id: response.id,
                producerId: response.producerId,
                kind: response.kind,
                rtpParameters: response.rtpParameters,
              });
              setConsumer(consumer);
              const stream = new MediaStream();
              stream.addTrack(consumer.track);
              if (response.kind === "video" && remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream;
              }
            } catch (error) {
              console.error("❌ Consumer 생성 오류:", error);
            }
          }
        );
      });
    });
  };

  const [activeScreen, setActiveScreen] = useState("rooms");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [fontSize, setFontSize] = useState("medium");
  const [letterSpacing, setLetterSpacing] = useState("normal");
  const [fontFamily, setFontFamily] = useState("binggraetaom");
  const [isVideoPopoverOpen, setIsVideoPopoverOpen] = useState(false);
  const [showOpenChats, setShowOpenChats] = useState(false);
  const [newChatUserId, setNewChatUserId] = useState("");

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
  }, [messages]);

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

  const filteredRooms = myRooms.filter((room) => !room.isOpenChat);
  const router = useRouter();
  const pathname = usePathname();

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
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-2 p-4">
            {filteredRooms.map((room) => (
              <motion.div
                key={room.roomId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 ${
                  currentRoom?.roomId === room.roomId ? "bg-[#96b23c] text-white" : "hover:bg-[#e6f3d4]"
                } ${fontSizes[fontSize]} ${letterSpacings[letterSpacing]}`}
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
                  <p className={`text-sm font-medium truncate ${currentRoom?.roomId === room.roomId ? "text-white" : "text-gray-900"}`}>
                    {room.isOpenChat ? room.name : extractOtherUserName(room.name, userNickname)}
                  </p>
                  {room.isOpenChat && (
                    <div className={`flex items-center text-xs ${currentRoom?.roomId === room.roomId ? "text-white/80" : "text-gray-500"}`}>
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
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-chat-primary-light border-t md:hidden">
        <div className="grid grid-cols-4 h-full">
          <Link href="/yesterday" className={`flex flex-col items-center justify-center ${pathname === "/yesterday" ? "text-[#96b23c]" : "text-dark-500"}`}>
            <Bean className="w-5 h-5" />
            <span className="text-xs mt-1">어제</span>
          </Link>
          <Link href="/today" className={`flex flex-col items-center justify-center ${pathname === "/today" ? "text-[#96b23c]" : "text-dark-500"}`}>
            <Sprout className="w-5 h-5" />
            <span className="text-xs mt-1">오늘</span>
          </Link>
          <Link href="/tomorrow" className={`flex flex-col items-center justify-center ${pathname === "/tomorrow" ? "text-[#96b23c]" : "text-dark-500"}`}>
            <Flower2 className="w-5 h-5" />
            <span className="text-xs mt-1">내일</span>
          </Link>
          <Link href="/profile" className={`flex flex-col items-center justify-center ${pathname === "/profile" ? "text-[#96b23c]" : "text-dark-500"}`}>
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">나의 봄</span>
          </Link>
        </div>
      </nav>
    </Card>
  );

  const renderEmptyChatScreen = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
        <Sprout className="text-[#96b23c] w-12 h-12 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">시작하기</h3>
        <p className="text-sm text-gray-700 mb-6">채팅방을 선택하거나 새로운 채팅을 시작하세요.</p>
        <Button onClick={() => setIsNewChatOpen(true)} variant="outline" className="px-6 py-2 text-sm rounded-full border-[#96b23c] text-[#96b23c] hover:bg-[#e6f3d4] transition-all duration-300 hover:scale-105">
          새 채팅
        </Button>
      </motion.div>
    </div>
  );

  const renderVideoPopover = () => (
    <Card className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <CardContent className="bg-white/95 p-6 rounded-2xl max-w-2xl w-full shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Video className="text-[#96b23c] w-5 h-5" />
            <CardTitle className={`${fontSizes[fontSize]} ${letterSpacings[letterSpacing]} text-gray-900`}>Video Chat</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsVideoPopoverOpen(false)} className="hover:bg-[#e6f3d4] text-[#96b23c]">
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
          <Button onClick={toggleVideoStreaming} variant={isStreaming ? "destructive" : "default"} className={`${isStreaming ? "bg-red-500 hover:bg-red-600" : "bg-[#96b23c] hover:bg-[#7a9431]"} text-white transition-all duration-300 hover:scale-105`}>
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
          <Button variant="ghost" size="icon" onClick={() => setActiveScreen("rooms")} className="md:hidden hover:bg-[#e6f3d4] text-[#96b23c]">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {currentRoom && (
            <Avatar className="border-2 border-white shadow-sm">
              <AvatarImage src={getProfileImageForRoom(currentRoom)} />
              <AvatarFallback>
                {currentRoom.isOpenChat ? currentRoom.name?.[0] : (extractOtherUserName(currentRoom.name, userNickname)?.charAt(0) || "U")}
              </AvatarFallback>
            </Avatar>
          )}
          <CardTitle className={`${fontSizes[fontSize]} ${letterSpacings[letterSpacing]} text-gray-900`}>
            {currentRoom ? (currentRoom.isOpenChat ? currentRoom.name : extractOtherUserName(currentRoom.name, userNickname)) : ""}
          </CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          {currentRoom && !isOpenChat && (
            <Button variant="ghost" size="icon" onClick={() => setIsVideoPopoverOpen(true)} className={`hover:bg-[#e6f3d4] ${isStreaming ? "text-red-500" : "text-[#96b23c]"}`}>
              <Video className="h-4 w-4" />
            </Button>
          )}
          {currentRoom && !isOpenChat && isActive && (
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
                    <Button variant="ghost" className="w-full justify-start bg-red-600 hover:bg-[#ff4141] text-white" onClick={() => { leaveRoom(); setActiveScreen("rooms"); setIsSettingsOpen(false); }}>
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
                  <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.sender === currentUserId ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${msg.sender === currentUserId ? "bg-[#96b23c] text-white" : "bg-white text-gray-900"} ${fontSizes[fontSize]} ${letterSpacings[letterSpacing]}`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <div className="p-4 pb-0 border-t border-gray-100 mt-auto">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex items-center space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className={`flex-1 border-[#96b23c] focus-visible:ring-[#96b23c] ${fontSizes[fontSize]} ${letterSpacings[letterSpacing]}`}
              />
              <Button type="submit" size="icon" disabled={!currentRoom || !isActive} className="bg-[#96b23c] hover:bg-[#7a9431] text-white transition-all duration-300 hover:scale-105">
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
            <DialogDescription className="text-gray-700">이야기를 나누고 싶은 사람을 선택하세요.</DialogDescription>
          </DialogHeader>
          <div className="px-4 pb-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="닉네임 또는 이메일 검색..."
              className="border-[#96b23c] focus-visible:ring-[#96b23c]"
            />
          </div>
          <div className="grid gap-4 py-4 max-h-60 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.id} onClick={() => { startPrivateChat(user.id); setIsNewChatOpen(false); }} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-[#e6f3d4] transition">
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
            <Button variant="outline" onClick={() => setIsNewChatOpen(false)} className="border-[#96b23c] text-[#96b23c] hover:bg-[#e6f3d4]">
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat1;
