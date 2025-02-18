"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Video, Settings, Send, Users, Eye, EyeOff, Sprout } from "lucide-react";
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

// 서버 관련 상수 선언
const SERVER_URL = "http://localhost:8080/chat";
const USER_SESSION_URL = "http://localhost:8080/user/me";
const SOCKET_SERVER_URL = "http://localhost:4000"; // WebRTC 서버

// 메시지 인터페이스 – 내부에서는 sender 필드를 사용 (기존 1:1 채팅과 동일)
interface Message {
  id: string;
  sender: string; // 서버에서 내려온 userId를 sender로 사용
  nickname: string;
  content: string;
  timestamp: string;
}

interface Room {
  id: number | string;
  name: string;
  isOpenChat: boolean;
  userCount?: number;
}

interface OpenChatProps {
  room: Room;
  messages: Message[];
  currentUserId: string;
  userNickname: string;
  onSendMessage: (message: string) => void;
  onBack?: () => void;
}

const fontSizes: Record<"small" | "medium" | "large", string> = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
};

const letterSpacings: Record<"tight" | "normal" | "wide", string> = {
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
};

const fontFamilies: { [key: string]: string } = {
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

const NewOpenChat: React.FC<OpenChatProps> = ({
  room,
  messages,
  currentUserId,
  userNickname,
  onSendMessage,
  onBack,
}) => {
  const [message, setMessage] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [letterSpacing, setLetterSpacing] = useState<"tight" | "normal" | "wide">("normal");
  const [fontFamily, setFontFamily] = useState("binggraetaom");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage("");
  };

  // 오픈 채팅의 경우 Dicebear API를 사용하여 room.name을 기반으로 프로필 이미지를 생성
  const getProfileImage = () => {
    return `https://api.dicebear.com/6.x/initials/svg?seed=${room.name}`;
  };

  return (
    <Card className={`${fontFamilies[fontFamily]} flex flex-col h-full border-none pb-10 mb-5 bg-white/50 backdrop-blur-sm shadow-lg`}>
      <CardHeader className="flex flex-row items-center justify-between py-2 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden hover:bg-[#e6f3d4] text-[#96b23c]">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Avatar className="border-2 border-white shadow-sm">
            <AvatarImage src={getProfileImage()} />
            <AvatarFallback>{room.name?.[0]}</AvatarFallback>
          </Avatar>
          <CardTitle className={`${fontSizes[fontSize]} ${letterSpacings[letterSpacing]} text-gray-900`}>
            {room.name}
          </CardTitle>
        </div>
        <div className="flex items-center space-x-2">
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
                  <Select value={fontSize} onValueChange={(value) => setFontSize(value as "small" | "medium" | "large")}>
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
                  <Select value={letterSpacing} onValueChange={(value) => setLetterSpacing(value as "tight" | "normal" | "wide")}>
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
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="flex flex-col space-y-4 p-4">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === currentUserId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${
                  msg.sender === currentUserId ? "bg-[#96b23c] text-white" : "bg-white text-gray-900"
                } ${fontSizes[fontSize]} ${letterSpacings[letterSpacing]}`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <div className="p-4 pb-0 border-t border-gray-100">
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
            className={`${fontSizes[fontSize]} ${letterSpacings[letterSpacing]} border-[#96b23c] focus-visible:ring-[#96b23c]`}
          />
          <Button type="submit" size="icon" className="bg-[#96b23c] hover:bg-[#7a9431] text-white transition-all duration-300">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default NewOpenChat;
