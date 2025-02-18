"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "../../hooks/chatUseMediaQuery";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import NewMessageModal from "./NewMessageModal";
import { themeColors } from "../../types/chatTheme";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { fetchPaginatedChats, type ChatData } from "../../lib/chatMockData";
import Link from "next/link";
import { useTheme } from "../../contexts/ChatThemeContext";
import { ChatListSkeleton } from "./ChatListSkeleton";
import { useInView } from "react-intersection-observer";

export default function ChatList() {
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [chats, setChats] = useState<ChatData[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const currentChatId = pathname.split("/").pop();

  /** ✅ 초기 로딩은 inView에서 처리하므로 제거 */
  // useEffect(() => {
  //   loadMoreChats();
  // }, []);

  /** ✅ 스크롤 위치 감지 시 데이터 로드 */
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMoreChats();
    }
  }, [inView, hasMore, loading]);

  /** ✅ 중복 데이터 방지 로직 추가 */
  const loadMoreChats = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const newChats = await fetchPaginatedChats(page, 10);

      if (newChats.length === 0) {
        setHasMore(false);
      } else {
        // 중복 방지를 위해 새로운 채팅만 추가
        setChats((prevChats) => {
          const uniqueChats = newChats.filter((newChat) => !prevChats.some((prevChat) => prevChat.id === newChat.id));
          return [...prevChats, ...uniqueChats];
        });
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("채팅 목록을 불러오는 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`h-full flex flex-col ${themeColors[theme].background}`}>
      <div className={`px-4 py-3 border-b flex justify-between items-center ${themeColors[theme].background}`}>
        <h2 className={`text-lg font-bold ${themeColors[theme].text}`}>채팅</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsNewMessageModalOpen(true)} variant="ghost" size="icon" className={`hover:${themeColors[theme].secondary}`}>
            <MessageSquarePlus className={`h-5 w-5 ${themeColors[theme].text}`} />
            <span className="sr-only">새 메시지</span>
          </Button>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto ${themeColors[theme].background}`}>
        {chats.map((chat) => (
          <Link
            key={chat.id}
            href={`/chat/${chat.id}`}
            className={cn("block w-full text-left transition-colors focus:outline-none", chat.id === currentChatId ? themeColors[theme].secondary : `hover:${themeColors[theme].secondary}`)}
          >
            <div className={cn(`px-4 py-3 flex items-center justify-between border-b ${themeColors[theme].border}`, chat.id === currentChatId && "border-l-4 border-l-green-500")}>
              <div className="flex items-center space-x-3">
                <Avatar className={cn("w-12 h-12 border-2", chat.id === currentChatId ? "border-green-500" : `border-${themeColors[theme].background}`)}>
                  <AvatarImage src={chat.avatar} alt={chat.name} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={cn("font-medium", chat.id === currentChatId ? "text-green-600 dark:text-green-400" : themeColors[theme].text)}>{chat.name}</span>
                    <span className={`text-xs ${themeColors[theme].mutedText}`}>{chat.timestamp}</span>
                  </div>
                  <p className={`text-sm ${themeColors[theme].mutedText} line-clamp-1`}>{chat.lastMessage}</p>
                </div>
              </div>
              {chat.unread > 0 && <span className="flex-shrink-0 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">{chat.unread}</span>}
            </div>
          </Link>
        ))}

        {loading && <ChatListSkeleton />}
        <div ref={ref} style={{ height: "20px" }} />
      </div>

      <NewMessageModal isOpen={isNewMessageModalOpen} onClose={() => setIsNewMessageModalOpen(false)} theme={theme} />
    </div>
  );
}
