// /contexts/NotificationsContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import useNotifications from "@/hooks/useNotifications";
import type { Notification } from "@/app/notifications/types/notifications";
import axiosAPI from "@/lib/api/axios";

interface NotificationsContextType {
  notifications: Notification[];
  clearNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  console.log("🔍 NEXT_PUBLIC_API_BASE_URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

  // (예시) 사용자 세션 정보 가져오기
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await axiosAPI.get("/user/me");
        console.log("✅ 사용자 세션 데이터:", response.data);
        
        setCurrentUserId(response.data.userId);
      } catch (error) {
        console.error("❌ 사용자 정보를 가져오는 데 실패:", error);
        setCurrentUserId(null);
      }
    };

    fetchUserSession();
  }, []);

  /**
   * userId를 성공적으로 가져온 뒤에만 SSE 구독 URL 생성
   * - null이면 아직 사용자 정보가 없으므로 구독 X
   */
  const sseUrl = currentUserId
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"}/notifications/subscribe/${currentUserId}`
    : undefined;

  // useNotifications 훅 사용 (url이 없으면 SSE 연결하지 않음)
  const { notifications, clearNotifications } = useNotifications(sseUrl);

  return (
    <NotificationsContext.Provider value={{ notifications, clearNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotificationsContext must be used within a NotificationsProvider");
  }
  return context;
};
