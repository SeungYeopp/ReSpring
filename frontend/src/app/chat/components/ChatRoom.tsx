"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import { getChatMessages, joinChatRoom, leaveChatRoom, sendMessage } from "@/lib/api/chat";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ChatMessage } from "../mocks/chatData";
import { Send, Video, VideoOff, Smile } from "lucide-react";
import dynamic from "next/dynamic";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface ChatRoomProps {
  roomId: string;
  userId: string;
  onLeave: () => void;
  chatType: "open" | "private";
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId, userId, onLeave, chatType }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setupChatRoom = async () => {
      try {
        await joinChatRoom(roomId, userId);
        fetchMessages();
      } catch (error) {
        console.error("채팅방 설정에 실패했습니다:", error);
      }
    };

    setupChatRoom();

    return () => {
      leaveChatRoom(roomId, userId);
    };
  }, [roomId, userId]);

  useEffect(() => {
    scrollToBottom();
  }, []);

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

  const fetchMessages = async () => {
    try {
      const messagesData = await getChatMessages(roomId);
      setMessages(messagesData);
    } catch (error) {
      console.error("채팅 메시지를 가져오는 데 실패했습니다:", error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await sendMessage(roomId, newMessage, userId);
        setNewMessage("");
        fetchMessages();
      } catch (error) {
        console.error("메시지 전송에 실패했습니다:", error);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleVideo = () => {
    setIsVideoActive(!isVideoActive);
    // 여기에 실제 비디오 채팅 시작/종료 로직을 추가할 수 있습니다.
  };

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <Card className="h-full flex flex-col bg-white dark:bg-chat-dark-background">
      {isVideoActive && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-chat-secondary dark:bg-chat-dark-secondary">
          <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">내 비디오</div>
          <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">상대방 비디오</div>
        </div>
      )}
      <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.userId === userId ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.userId === userId
                  ? "bg-chat-primary text-white dark:bg-chat-dark-primary dark:text-white rounded-br-none"
                  : "bg-chat-secondary text-chat-secondary-foreground dark:bg-chat-dark-secondary dark:text-chat-dark-secondary-foreground rounded-bl-none"
              }`}
            >
              <p className="break-words text-sm sm:text-base">{message.content}</p>
              <div className={`text-xs mt-1 text-right ${message.userId === userId ? "text-white/80" : "text-gray-500"}`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="p-4 bg-chat-secondary dark:bg-chat-dark-secondary">
        <div className="flex w-full space-x-2">
          {chatType === "private" && (
            <Button onClick={toggleVideo} variant="outline" className={isVideoActive ? "bg-red-100" : ""}>
              {isVideoActive ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
            </Button>
          )}
          <div className="relative flex-grow">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex space-x-2 w-full"
            >
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="w-full bg-white dark:bg-chat-dark-background text-black dark:text-chat-dark-text"
              />
              {showEmojiPicker && (
                <div ref={emojiPickerRef} className="absolute left-0 bottom-full mb-2 w-full">
                  <EmojiPicker onEmojiClick={handleEmojiClick} width="100%" />
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="px-2 bg-white hover:bg-gray-100 dark:bg-chat-dark-background dark:hover:bg-chat-dark-secondary"
              >
                <Smile className="h-5 w-5 text-black fill-yellow-500 dark:text-white dark:fill-yellow-300" />
              </Button>
              <Button type="submit" className="bg-chat-primary hover:bg-chat-primary-dark dark:bg-chat-dark-primary dark:hover:bg-chat-dark-primary-dark">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatRoom;
