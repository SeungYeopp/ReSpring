"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { getChatRooms, createOpenChatRoom, startPrivateChat } from "@/lib/api/chat";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ChatRoom } from "../mocks/chatData";
import { PlusCircle, MessageSquare, Users, Search } from "lucide-react";

interface ChatListProps {
  userId: string;
  onSelectRoom: (roomId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ userId, onSelectRoom }) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [newPrivateChatUser, setNewPrivateChatUser] = useState("");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const roomsData = await getChatRooms(userId);
      setRooms(roomsData);
    } catch (error) {
      console.error("채팅방 목록을 가져오는 데 실패했습니다:", error);
    }
  };

  const handleCreateOpenRoom = async () => {
    if (newRoomName.trim()) {
      try {
        await createOpenChatRoom({ name: newRoomName, creatorId: userId });
        setNewRoomName("");
        fetchRooms();
        setIsCreatingRoom(false);
      } catch (error) {
        console.error("오픈 채팅방 생성에 실패했습니다:", error);
      }
    }
  };

  const handleStartPrivateChat = async () => {
    if (newPrivateChatUser.trim()) {
      try {
        const newRoom = await startPrivateChat(userId, newPrivateChatUser);
        setNewPrivateChatUser("");
        fetchRooms();
        onSelectRoom(newRoom.id);
      } catch (error) {
        console.error("1:1 채팅 시작에 실패했습니다:", error);
      }
    }
  };

  const filteredOpenRooms = rooms.filter((room) => room.type === "open" && room.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredPrivateRooms = rooms.filter((room) => room.type === "private" && room.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const renderRoomList = (roomList: ChatRoom[]) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
      {roomList.map((room) => (
        <Card key={room.id} className="hover:shadow-lg transition-shadow duration-300 bg-chat-secondary dark:bg-chat-dark-secondary">
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2 text-chat-primary-dark dark:text-chat-dark-primary-light">{room.name}</h3>
            <p className="text-sm text-gray-600 dark:text-chat-dark-text mb-2 line-clamp-2">{room.lastMessage}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-chat-secondary-foreground flex items-center">
                {room.type === "open" ? <Users className="mr-1 h-4 w-4" /> : <MessageSquare className="mr-1 h-4 w-4" />}
                {room.type === "open" ? "오픈 채팅" : "1:1 채팅"}
              </span>
              <Button
                onClick={() => onSelectRoom(room.id)}
                variant="outline"
                className="text-chat-primary hover:bg-chat-primary hover:text-white dark:text-chat-dark-primary dark:hover:bg-chat-dark-primary dark:hover:text-white"
              >
                입장하기
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          type="text"
          placeholder="채팅방 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white dark:bg-chat-dark-background text-black dark:text-chat-dark-text"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>

      <Tabs defaultValue="open" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-chat-secondary dark:bg-chat-dark-secondary">
          <TabsTrigger value="open" className="data-[state=active]:bg-chat-primary data-[state=active]:text-white dark:data-[state=active]:bg-chat-dark-primary dark:data-[state=active]:text-white">
            오픈 채팅
          </TabsTrigger>
          <TabsTrigger value="private" className="data-[state=active]:bg-chat-primary data-[state=active]:text-white dark:data-[state=active]:bg-chat-dark-primary dark:data-[state=active]:text-white">
            1:1 채팅
          </TabsTrigger>
        </TabsList>
        <TabsContent value="open">
          <div className="space-y-4">
            {isCreatingRoom ? (
              <div className="flex flex-col space-y-2">
                <Input value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} placeholder="새 오픈 채팅방 이름" className="w-full" />
                <div className="flex space-x-2">
                  <Button onClick={handleCreateOpenRoom} className="flex-1 bg-chat-primary hover:bg-chat-primary-dark">
                    <PlusCircle className="mr-2 h-4 w-4" /> 생성
                  </Button>
                  <Button onClick={() => setIsCreatingRoom(false)} variant="outline" className="flex-1">
                    취소
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsCreatingRoom(true)} className="w-full bg-chat-primary hover:bg-chat-primary-dark">
                <PlusCircle className="mr-2 h-4 w-4" /> 오픈 채팅방 생성
              </Button>
            )}
          </div>
          {renderRoomList(filteredOpenRooms)}
        </TabsContent>
        <TabsContent value="private">
          <div className="space-y-4">
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Input value={newPrivateChatUser} onChange={(e) => setNewPrivateChatUser(e.target.value)} placeholder="1:1 채팅 상대방 ID" className="w-full sm:flex-grow" />
              <Button onClick={handleStartPrivateChat} className="w-full sm:w-auto bg-chat-primary-light hover:bg-chat-primary">
                <MessageSquare className="mr-2 h-4 w-4" /> 1:1 채팅 시작
              </Button>
            </div>
          </div>
          {renderRoomList(filteredPrivateRooms)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatList;
