"use client";

import { useMediaQuery } from "./hooks/chatUseMediaQuery";
import ChatLayout from "./components/chat/ChatLayout";
import ChatList from "./components/chat/ChatList";
import EmptyChatScreen from "./components/chat/EmptyChatScreen";

export default function ChatPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return <ChatLayout>{isMobile ? <ChatList /> : <EmptyChatScreen />}</ChatLayout>;
}
