"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Smile, Settings, Plus, Minus } from "lucide-react";
import { useMediaQuery } from "../../hooks/chatUseMediaQuery";
import { themeColors } from "../../types/chatTheme";
import { useTheme } from "../../contexts/ChatThemeContext";
import dynamic from "next/dynamic";
import type { ChatData } from "../../lib/chatMockData";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function ChatRoomClient({ initialChatData }: { initialChatData: ChatData }) {
  if (!initialChatData) {
    return <div>채팅 데이터를 불러올 수 없습니다.</div>;
  }
  const [chatData, setChatData] = useState(initialChatData);
  const [messages, setMessages] = useState(initialChatData.messages || []);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [font, setFont] = useState("sans");
  const [fontSize, setFontSize] = useState(16);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const scrollRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [scrollRef, messages]); //Corrected dependency

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setChatData(initialChatData);
    setMessages(initialChatData.messages);
  }, [initialChatData]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: Date.now().toString(),
        content: newMessage,
        senderId: "user",
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage("");
    }
  };

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleFontSizeChange = (increment: boolean) => {
    setFontSize((prev) => {
      const newSize = increment ? prev + 1 : prev - 1;
      return Math.min(Math.max(newSize, 12), 24);
    });
  };

  return (
    <div className={`flex flex-col h-full ${themeColors[theme].background} ${themeColors[theme].text}`}>
      <div className="flex items-center p-4 border-b">
        {isMobile && (
          <Button variant="ghost" className="mr-2" onClick={() => router.push("/chat")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="w-10 h-10 mr-3">
          <AvatarImage src={chatData.avatar} alt={chatData.name} />
          <AvatarFallback>{chatData.name[0]}</AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-semibold">{chatData.name}</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className={`ml-auto hover:${themeColors[theme].secondary}`}>
              <Settings className={`h-5 w-5 ${themeColors[theme].text}`} />
              <span className="sr-only">설정</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className={`w-72 ${themeColors[theme].background} ${themeColors[theme].text}`} align="end" side="bottom">
            <div className="grid gap-3">
              <div className="grid grid-cols-12 items-center gap-2">
                <label htmlFor="theme" className="col-span-4">
                  테마
                </label>
                <div className="col-span-8">
                  <Select onValueChange={setTheme} value={theme}>
                    <SelectTrigger id="theme" className={`w-full min-w-[8rem] ${themeColors[theme].background} ${themeColors[theme].text}`}>
                      <SelectValue placeholder="테마 선택" />
                    </SelectTrigger>
                    <SelectContent className={`${themeColors[theme].background} ${themeColors[theme].text} min-w-[8rem] w-full`}>
                      <SelectItem value="light">라이트 모드</SelectItem>
                      <SelectItem value="dark">다크 모드</SelectItem>
                      <SelectItem value="spring">봄</SelectItem>
                      <SelectItem value="summer">여름</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-12 items-center gap-2">
                <label htmlFor="font" className="col-span-4">
                  폰트
                </label>
                <div className="col-span-8">
                  <Select onValueChange={setFont} value={font}>
                    <SelectTrigger id="font" className={`w-full min-w-[8rem] ${themeColors[theme].background} ${themeColors[theme].text}`}>
                      <SelectValue placeholder="폰트 선택" />
                    </SelectTrigger>
                    <SelectContent className={`${themeColors[theme].background} ${themeColors[theme].text} min-w-[8rem] w-full`}>
                      <SelectItem value="sans">Sans-serif</SelectItem>
                      <SelectItem value="serif">Serif</SelectItem>
                      <SelectItem value="mono">Monospace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-12 items-center gap-2">
                <label htmlFor="fontSize" className="col-span-4">
                  글자 크기
                </label>
                <div className="col-span-8 flex items-center justify-between gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleFontSizeChange(false)}
                    disabled={fontSize <= 12}
                    className={`h-8 w-8 ${themeColors[theme].background} ${themeColors[theme].text}`}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="min-w-[3ch] text-center">{fontSize}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleFontSizeChange(true)}
                    disabled={fontSize >= 24}
                    className={`h-8 w-8 ${themeColors[theme].background} ${themeColors[theme].text}`}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.senderId === "user" ? "justify-end" : "justify-start"} mb-4`}>
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.senderId === "user" ? `${themeColors[theme].primary} text-white rounded-br-none` : `${themeColors[theme].secondary} ${themeColors[theme].text} rounded-bl-none`
              }`}
              style={{
                fontFamily: font === "sans" ? "sans-serif" : font === "serif" ? "serif" : "monospace",
                fontSize: `${fontSize}px`,
              }}
            >
              <p className="break-words">{message.content}</p>
              <p className="text-xs mt-1 text-right opacity-70">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex w-full space-x-2">
          <div className="relative flex-grow">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex space-x-2 w-full"
            >
              <Input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className={`flex-grow ${themeColors[theme].background} ${themeColors[theme].text}`}
              />
              {showEmojiPicker && (
                <div ref={emojiPickerRef} className="absolute left-0 bottom-full mb-2">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
              <Button type="button" variant="outline" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`px-2 ${themeColors[theme].background} ${themeColors[theme].text}`}>
                <Smile className="h-5 w-5" />
              </Button>
              <Button type="submit" className={`${themeColors[theme].primary} hover:${themeColors[theme].primary} text-white`}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
