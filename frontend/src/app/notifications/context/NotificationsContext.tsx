// /contexts/NotificationsContext.tsx
"use client";

import React, { createContext, useContext } from "react";
import useNotifications from "@/hooks/useNotifications";
import type { Notification } from "@/app/notifications/types/notifications";

interface NotificationsContextType {
  notifications: Notification[];
  clearNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  // 사용자 ID는 여기서 하드코딩하거나, 인증 정보 등에서 가져올 수 있습니다.
  const { notifications, clearNotifications } = useNotifications(
    `http://localhost:8080/notifications/subscribe`
  );

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
