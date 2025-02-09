import { notFound } from "next/navigation";
import { getChatById } from "../lib/chatMockData";
import ChatRoom from "../components/chat/ChatRoom";
import ChatLayout from "../components/chat/ChatLayout";

export default function ChatRoomPage({ params }: { params: { chatId: string } }) {
  const chatData = getChatById(params.chatId);

  if (!chatData) {
    notFound();
  }

  return (
    <ChatLayout>
      <ChatRoom initialChatData={chatData} />
    </ChatLayout>
  );
}
