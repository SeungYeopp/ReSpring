"use client";

import { useState, useEffect } from "react";
import ChatList from "./components/ChatList";
import ChatRoom from "./components/ChatRoom";
import { getChatRooms } from "@/lib/api/chat";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Sun, LogOut } from "lucide-react";
import type { ChatRoom as ChatRoomType } from "./mocks/chatData";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { leaveChatRoom } from "@/lib/api/chat";

const ChatPage = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("user123"); // 실제 앱에서는 로그인 시스템에서 가져와야 합니다.
  const [rooms, setRooms] = useState<ChatRoomType[]>([]);

  useEffect(() => {
    const fetchInitialRooms = async () => {
      try {
        const roomsData = await getChatRooms(userId);
        setRooms(roomsData);
      } catch (error) {
        console.error("초기 채팅방 목록을 가져오는 데 실패했습니다:", error);
      }
    };

    fetchInitialRooms();
  }, [userId]);

  return (
    <div className="w-full h-[calc(100vh-3.5rem-4rem)] md:h-[calc(100vh-1rem)] overflow-hidden">
      <div className="h-full p-4 md:p-6 flex flex-col">
        <div className="bg-white rounded-lg shadow-md p-4 flex-grow overflow-hidden">
          {selectedRoomId ? (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <Button
                  onClick={() => setSelectedRoomId(null)}
                  variant="ghost"
                  className="text-chat-primary hover:text-chat-primary-dark dark:text-chat-dark-primary dark:hover:text-chat-dark-primary-light"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> 채팅방 목록으로 돌아가기
                </Button>
                <DropdownMenu>
                  {rooms.find((room) => room.id === selectedRoomId)?.type === "private" && (
                    <>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="text-chat-primary hover:text-chat-primary-dark dark:text-chat-dark-primary dark:hover:text-chat-dark-primary-light">
                          <Settings className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 bg-white dark:bg-chat-dark-background">
                        <DropdownMenuItem
                          onClick={() => {
                            if (selectedRoomId) {
                              leaveChatRoom(selectedRoomId, userId);
                            }
                          }}
                          className="cursor-pointer text-red-500 dark:text-red-400"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>채팅방 나가기</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </>
                  )}
                </DropdownMenu>
              </div>
              <div className="flex-grow overflow-hidden">
                <ChatRoom roomId={selectedRoomId} userId={userId} onLeave={() => setSelectedRoomId(null)} chatType={rooms.find((room) => room.id === selectedRoomId)?.type || "open"} />
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <ChatList userId={userId} onSelectRoom={(roomId) => setSelectedRoomId(roomId)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
