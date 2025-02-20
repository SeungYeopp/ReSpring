"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  BellOff,
  Bell,
  MessageSquare,
  ThumbsUp,
  UserPlus,
  Reply,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import NotificationSkeleton from "./components/NotificationSkeleton";
import LoadingSpinner from "./components/LoadingSpinner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNotificationsContext } from "./context/NotificationsContext";
import { getSessionInfo } from "@/lib/api";


// ------------------------------------------------------------------
// 타입 선언
// ------------------------------------------------------------------
export interface Notification {
  id: number;
  type: NotificationType;
  targetType: string;
  targetId: number;
  message: string;
  createdAt: string;
  read: boolean;
}

export type NotificationType = "COMMENT" | "LIKE" | "SUBSCRIBE" | "REPLY";



const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";


// 한 페이지에 한 번에 보여줄 알림 개수
const ITEMS_PER_PAGE = 10;
type ReadStatus = "ALL" | "READ" | "UNREAD";





// ------------------------------------------------------------------
// NotificationPage 컴포넌트
// ------------------------------------------------------------------
const NotificationPage = () => {
  // 사용자 UUID (하드코딩; 실제로는 인증정보 등에서 가져와야 함)
  // const userId = "beb9ebc2-9d32-4039-8679-5d44393b7252";

  // ------------------------------------------------------------------
  // API 호출 함수들 (GET, PATCH)
  // ------------------------------------------------------------------
  // const fetchInitialNotifications = useCallback(async () => {
  //   try {
  //     const response = await fetch("http://localhost:8080/notifications", {
  //       credentials: "include", // 세션 정보를 포함하여 요청
  //     });
  //     if (!response.ok) {
  //       throw new Error("네트워크 응답이 정상이 아닙니다");
  //     }
  //     const data: Notification[] = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error("초기 알림 데이터 GET 요청 에러:", error);
  //     return [];
  //   }
  // }, []);

  const fetchInitialNotifications = useCallback(async () => {
    try {
      // 세션 정보에서 userId를 가져옵니다.
      const userInfo = await getSessionInfo();
      const userId = userInfo.userId;
  
      // userId를 쿼리 파라미터로 전달하여 알림 데이터를 요청합니다.
      const response = await fetch(`${API_BASE_URL}/notifications/${userId}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("네트워크 응답이 정상이 아닙니다");
      }
      const data: Notification[] = await response.json();
      return data;
    } catch (error) {
      console.error("초기 알림 데이터 GET 요청 에러:", error);
      return [];
    }
  }, []);
  

  const markNotificationRead = async (notificationId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("알림 읽음 처리에 실패했습니다.");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn("알림 읽음 처리 응답 본문이 비어 있습니다:", error);
      return null;
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
          }
      );

      if (!response.ok) {
        throw new Error("전체 알림 읽음 처리에 실패했습니다.");
      }

      const data = await response.json();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      return data;
    } catch (error) {
      console.error("전체 알림 읽음 처리 에러:", error);
      return null;
    }
  };

  // ------------------------------------------------------------------
  // 초기 GET 요청으로 기존 알림 데이터 불러오기 (최신순 정렬)
  // ------------------------------------------------------------------
  useEffect(() => {
    const initFetch = async () => {
      const initialData = await fetchInitialNotifications();
      if (initialData.length > 0) {
        // 최신순(내림차순) 정렬
        const sortedData = initialData.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setNotifications(sortedData);
      }
      // 데이터가 있든 없든 로딩 상태 해제
      setIsInitialLoad(false);
    };
  
    initFetch();
  }, [fetchInitialNotifications]);
  
  // ----------------------------------------------------------------
  // 상태 관리
  // ----------------------------------------------------------------
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [displayedNotifications, setDisplayedNotifications] = useState<
    Notification[]
  >([]);
  const [filter, setFilter] = useState<NotificationType | "ALL">("ALL");
  const [readStatus, setReadStatus] = useState<ReadStatus>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const { notifications: sseNotifications } = useNotificationsContext();

  const loadMore = useCallback(() => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setPage((prev) => prev + 1);
      setIsLoadingMore(false);
    }, 1000);
  }, [isLoadingMore]);

  const loaderRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      if (node) {
        const options = {
          root: null,
          rootMargin: "20px",
          threshold: 0.1,
        };
        observer.current = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting && hasMore && !isLoadingMore) {
            loadMore();
          }
        }, options);
        observer.current.observe(node);
      }
    },
    [hasMore, isLoadingMore, loadMore]
  );

  // ----------------------------------------------------------------
  // 초기 GET 요청으로 기존 알림 데이터 불러오기 (최신순 정렬)
  // ----------------------------------------------------------------
  useEffect(() => {
    const initFetch = async () => {
      const initialData = await fetchInitialNotifications();
      if (initialData.length > 0) {
        // 최신순(내림차순) 정렬
        const sortedData = initialData.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setNotifications(sortedData);
        setIsInitialLoad(false);
      }
    };
    initFetch();
  }, [fetchInitialNotifications]);

  // ----------------------------------------------------------------
  // 불필요한 SSE 구독 제거
  // ----------------------------------------------------------------
  // NotificationPage에서는 별도의 SSE 구독을 하지 않고,
  // 전역 상태나 Context를 통해 알림 데이터를 받아서 사용하도록 합니다.
  // (만약 전역 구독이 없다면 이 부분은 수정 후 사용하시길 바랍니다.)
  useEffect(() => {
    if (sseNotifications.length === 0) return;

    setNotifications((prevNotifications) => {
      const newNotifications = sseNotifications.filter(
        (sseNotif) =>
          !prevNotifications.some((notif) => notif.id === sseNotif.id)
      );

      if (newNotifications.length === 0) return prevNotifications;

      const updatedNotifications = [
        ...newNotifications,
        ...prevNotifications,
      ].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return updatedNotifications;
    });
  }, [sseNotifications]);

  // ----------------------------------------------------------------
  // 필터링, 검색 및 페이지네이션
  // ----------------------------------------------------------------
  const filterAndSearchNotifications = useCallback(() => {
    let filtered = notifications;
    if (filter !== "ALL") {
      filtered = filtered.filter((notif) => notif.type === filter);
    }
    if (readStatus !== "ALL") {
      filtered = filtered.filter((notif) =>
        readStatus === "READ" ? notif.read : !notif.read
      );
    }
    if (searchTerm) {
      filtered = filtered.filter((notif) =>
        notif.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [filter, readStatus, searchTerm, notifications]);

  useEffect(() => {
    const filtered = filterAndSearchNotifications();
    setDisplayedNotifications(filtered.slice(0, page * ITEMS_PER_PAGE));
    setHasMore(filtered.length > page * ITEMS_PER_PAGE);
  }, [filterAndSearchNotifications, page]);

  // ----------------------------------------------------------------
  // 알림 읽음 처리 (PATCH API 호출) - userId 제거
  // ----------------------------------------------------------------
  const markAsRead = async (id: number) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("알림 읽음 처리 에러:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsRead(); //   userId 제거
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error("전체 알림 읽음 처리 에러:", error);
    }
  };

  // ----------------------------------------------------------------
  // 기타 유틸리티 함수들
  // ----------------------------------------------------------------
  // const getNotificationLink = (targetType: string, targetId: number) => {
  //   switch (targetType) {
  //     case "POST":
  //     case "COMMENT": // COMMENT도 POST와 동일하게 처리
  //       return `/today/${targetId}`;
  //     case "BOOK":
  //       return `/yesterday/book/${targetId}`;
  //     case "USER":
  //       return `/profile/${targetId}`;
  //     default:
  //       return "/";
  //   }
  // };


  const getNotificationLink = (
    targetType: string,
    targetId: number,
    message?: string
  ): string => {
    if (targetType === "USER") {
      // 메시지 형식 예시: "{닉네임}님이 당신을 구독했습니다."
      if (message) {
        const nicknameMatch = message.match(/^(.*?)님이/);
        if (nicknameMatch && nicknameMatch[1]) {
          return `/profile/${nicknameMatch[1]}`;
        }
      }
      // 메시지가 없거나 닉네임 추출에 실패한 경우 적절한 fallback 처리
      return "/";
    }
  
    // USER가 아닌 경우 기존 로직에 따른 경로 반환
    switch (targetType) {
      case "POST":
      case "COMMENT": // COMMENT도 POST와 동일하게 처리
        return `/today/${targetId}`;
      case "BOOK":
        return `/yesterday/book/${targetId}`;
      default:
        return "/";
    }
  };
  


  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "COMMENT":
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case "LIKE":
        return <ThumbsUp className="w-4 h-4 text-red-500" />;
      case "SUBSCRIBE":
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case "REPLY":
        return <Reply className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts.filter(Boolean).map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-yellow-200">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  // ----------------------------------------------------------------
  // 렌더링 함수
  // ----------------------------------------------------------------
  const renderNotifications = () => {
    // 로딩 중인 경우
    if (isInitialLoad) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <NotificationSkeleton key={index} />
          ))}
        </div>
      );
    }
  
    // 로딩 완료 후, 알림 데이터가 없는 경우
    if (!isInitialLoad && notifications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <BellOff className="w-12 h-12 mb-2" />
          <p className="text-lg">새로운 알림이 없습니다</p>
        </div>
      );
    }
  
    // 데이터는 있으나, 현재 필터나 검색으로 표시될 알림이 없는 경우
    if (displayedNotifications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <p className="text-lg">조건에 맞는 알림이 없습니다</p>
        </div>
      );
    }
  
    // 알림 데이터가 있는 경우
    return (
      <div className="space-y-4">
        {displayedNotifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-lg shadow-sm transition-all ${
              notif.read ? "bg-white" : "bg-blue-50"
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notif.type)}
              </div>
              <div className="flex-grow min-w-0">
              <Link
  href={getNotificationLink(notif.targetType, notif.targetId, notif.message)}
  className={`block text-sm ${
    notif.read ? "text-gray-600" : "text-gray-800 font-medium"
  }`}
>
  {highlightText(notif.message, searchTerm)}
</Link>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(notif.createdAt), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => !notif.read && markAsRead(notif.id)}
                    disabled={notif.read}
                    className="text-xs h-7 px-3 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    {notif.read ? "읽은 알림" : "읽기"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {hasMore && (
          <div ref={loaderRef} className="flex justify-center items-center h-20">
            {isLoadingMore && <LoadingSpinner />}
          </div>
        )}
      </div>
    );
  };
  
  // ----------------------------------------------------------------
  // 최종 렌더링
  // ----------------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
          <Bell className="w-6 h-6 text-blue-500" />
          <span>알림</span>
        </h1>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Select
            onValueChange={(value) =>
              setFilter(value as NotificationType | "ALL")
            }
          >
            <SelectTrigger className="w-full sm:w-28 h-8 text-xs">
              <SelectValue placeholder="필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">전체</SelectItem>
              <SelectItem value="COMMENT">댓글</SelectItem>
              <SelectItem value="LIKE">좋아요</SelectItem>
              <SelectItem value="SUBSCRIBE">구독</SelectItem>
              <SelectItem value="REPLY">답글</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={markAllAsRead}
            variant="outline"
            className="text-xs h-8 flex-grow sm:flex-grow-0"
          >
            모두 읽기
          </Button>
        </div>
      </div>

      <div className="relative">
        <Input
          type="text"
          placeholder="알림 내용 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <Tabs
        defaultValue="ALL"
        onValueChange={(value) => setReadStatus(value as ReadStatus)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ALL">전체</TabsTrigger>
          <TabsTrigger value="READ">읽은 알림</TabsTrigger>
          <TabsTrigger value="UNREAD">안읽은 알림</TabsTrigger>
        </TabsList>
        <TabsContent value="ALL">{renderNotifications()}</TabsContent>
        <TabsContent value="READ">{renderNotifications()}</TabsContent>
        <TabsContent value="UNREAD">{renderNotifications()}</TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationPage;
