"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { mockNotifications } from "./mocks/notifications";
import type { Notification, NotificationType } from "./types/notifications";
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

const ITEMS_PER_PAGE = 10;

type ReadStatus = "ALL" | "READ" | "UNREAD";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [displayedNotifications, setDisplayedNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<NotificationType | "ALL">("ALL");
  const [readStatus, setReadStatus] = useState<ReadStatus>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 무한스크롤 로직: 로더 엘리먼트에 callback ref를 적용
  const observer = useRef<IntersectionObserver | null>(null);

  // 무한 스크롤 동작을 위한 로딩 함수
  const loadMore = useCallback(() => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setPage((prevPage) => prevPage + 1);
      setIsLoadingMore(false);
    }, 1000); // 로딩 시뮬레이션
  }, [isLoadingMore]);

  // callback ref를 사용하여 로더 엘리먼트가 DOM에 나타날 때 옵저버를 등록
  const loaderRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) {
        observer.current.disconnect();
      }
      if (node) {
        const options = {
          root: null,
          rootMargin: "20px",
          threshold: 0.1, // 변경된 threshold 값
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

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // 로딩 시뮬레이션
      setNotifications(mockNotifications);
      setIsLoading(false);
      setIsInitialLoad(false);
    };
    fetchNotifications();
  }, []);

  const filterAndSearchNotifications = useCallback(() => {
    let filtered = notifications;
    if (filter !== "ALL") {
      filtered = filtered.filter((notif) => notif.type === filter);
    }
    if (readStatus !== "ALL") {
      filtered = filtered.filter((notif) => (readStatus === "READ" ? notif.read : !notif.read));
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

  const toggleReadStatus = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, read: !notif.read } : notif
      )
    );
  };

  const toggleAllReadStatus = () => {
    const allRead = notifications.every((notif) => notif.read);
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) => ({ ...notif, read: !allRead }))
    );
  };

  const getNotificationLink = (targetType: string, targetId: number) => {
    switch (targetType) {
      case "POST":
        return `/post/${targetId}`;
      case "BOOK":
        return `/book/${targetId}`;
      case "USER":
        return `/profile/${targetId}`;
      case "COMMENT":
        return `/comment/${targetId}`;
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
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts.filter(String).map((part, i) =>
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

  const renderNotifications = () => {
    if (isInitialLoad) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <NotificationSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">알림을 불러오는 중...</p>
        </div>
      );
    }

    if (displayedNotifications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <BellOff className="w-12 h-12 mb-2" />
          <p className="text-lg">새로운 알림이 없습니다</p>
        </div>
      );
    }

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
              <div className="flex-shrink-0 mt-1">{getNotificationIcon(notif.type)}</div>
              <div className="flex-grow min-w-0">
                <Link
                  href={getNotificationLink(notif.targetType, notif.targetId)}
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
                    onClick={() => toggleReadStatus(notif.id)}
                    className="text-xs h-7 px-3 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    {notif.read ? "안읽기" : "읽기"}
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

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
          <Bell className="w-6 h-6 text-blue-500" />
          <span>알림</span>
        </h1>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Select onValueChange={(value) => setFilter(value as NotificationType | "ALL")}>
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
          <Button onClick={toggleAllReadStatus} variant="outline" className="text-xs h-8 flex-grow sm:flex-grow-0">
            {notifications.every((notif) => notif.read) ? "모두 안읽기" : "모두 읽기"}
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

      <Tabs defaultValue="ALL" onValueChange={(value) => setReadStatus(value as ReadStatus)}>
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
