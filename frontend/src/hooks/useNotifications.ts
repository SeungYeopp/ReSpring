import { useState, useEffect, useRef } from "react";
import type { Notification } from "@/app/notifications/types/notifications";

/**
 * SSE 알림 구독 커스텀 훅
 * - 이벤트 타입(notification, connect) 별도 처리
 * - SSE 연결 상태 관리 및 재연결 로직 포함 (3초 후 재연결)
 * - 외부에서 알림 초기화 가능
 *
 * @param {string} sseUrl SSE 연결을 위한 API URL
 * @returns {object} notifications: 수신된 알림 배열, clearNotifications: 알림 초기화 함수
 */
const useNotifications = (sseUrl: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const connect = () => {
      console.log("SSE 연결 시도:", sseUrl);
      const eventSource = new EventSource(sseUrl);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => console.log("SSE 연결 성공:", sseUrl);

      eventSource.onerror = (error: Event & { status?: number }) => {
        console.error("SSE 연결 에러:", error);
        const status = error instanceof MessageEvent ? (error.data?.status ?? 0) : 0;

        if (status === 401) {
          console.warn("401 UNAUTHORIZED: SSE 재연결 중단");
        } else if (!isCancelled) {
          console.log("3초 후 SSE 재연결 시도");
          retryTimeoutRef.current = setTimeout(connect, 3000);
        }
        eventSource.close();
      };

      eventSource.addEventListener("notification", (event: MessageEvent) => {
        try {
          const parsedData = JSON.parse(event.data) as Notification;
          setNotifications((prev) => [...prev, parsedData]);
        } catch (error) {
          console.error("SSE 데이터 파싱 실패:", error);
        }
      });

      eventSource.addEventListener("connect", (event: MessageEvent) => {
        console.log("[connect] 이벤트 수신:", event.data);
      });

      return () => eventSource.close();
    };

    const cleanup = connect();

    return () => {
      isCancelled = true;
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      if (eventSourceRef.current) eventSourceRef.current.close();
      cleanup();
    };
  }, [sseUrl]);

  const clearNotifications = () => {
    setNotifications([]);
    console.log("알림 목록 초기화 완료");
  };

  return { notifications, clearNotifications };
};

export default useNotifications;
