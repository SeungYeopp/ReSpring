"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { themeColors } from "../../types/chatTheme";
import { useTheme } from "../../contexts/ChatThemeContext";
import { type UserData, fetchUsers, MOCK_CHATS } from "../../lib/chatMockData";
import { type Theme } from "../../types/chatTheme";  // Theme 타입 import



type NewMessageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
};

export default function NewMessageModal({ isOpen, onClose, theme }: NewMessageModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserData[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadUsers() {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    }
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelectUser = (userId: string) => {
    const existingChat = MOCK_CHATS.find((chat) => chat.userId === userId);
    if (existingChat) {
      router.push(`/chat/${existingChat.id}`);
    } else {
      const newChatId = `chat${Date.now()}`;
      router.push(`/chat/${newChatId}`);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${themeColors[theme].background} ${themeColors[theme].text}`}>
        <DialogHeader>
          <DialogTitle>새 메시지</DialogTitle>
          <DialogDescription>새로운 대화를 시작하거나 기존 대화에 참여하세요.</DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          placeholder="친구 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`mb-4 ${themeColors[theme].background} ${themeColors[theme].text}`}
        />
        <ScrollArea className="h-[300px]">
          {filteredUsers.map((user) => (
            <Button
              key={user.id}
              variant="ghost"
              className={`w-full justify-start mb-2 ${themeColors[theme].background} ${themeColors[theme].text} hover:${themeColors[theme].secondary}`}
              onClick={() => handleSelectUser(user.userId)}
            >
              <Avatar className="w-10 h-10 mr-3">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <span>{user.name}</span>
            </Button>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
