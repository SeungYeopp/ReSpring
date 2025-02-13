import { useState, useEffect, useRef } from "react";
import type { Notification } from "@/app/notifications/types/notifications";

const useNotifications = (sseUrl: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // 재연결 타이머와 EventSource 인스턴스를 보관할 ref
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const connect = () => {
      console.log("SSE 연결 시작:", sseUrl);
      const eventSource = new EventSource(sseUrl);
      eventSourceRef.current = eventSource;

      const handleMessage = (event: MessageEvent) => {
        console.log("SSE 메시지 이벤트 발생:", event);
        try {
          const parsedData: Notification = JSON.parse(event.data);
          console.log("SSE 데이터 파싱 성공:", parsedData);
          setNotifications((prev) => [...prev, parsedData]);
        } catch (error) {
          console.error("SSE 데이터 파싱 실패:", error);
        }
      };

      const handleError = (error: any) => {
        console.error("SSE 연결 에러:", error);
        // 에러 발생 시 현재 연결 종료
        eventSource.close();
        // 연결이 끊긴 경우 재연결 시도 (3초 후)
        if (!isCancelled) {
          console.log("SSE 재연결 시도 중...");
          retryTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000);
        }
      };

      eventSource.addEventListener("message", handleMessage);
      eventSource.addEventListener("error", handleError);
    };

    // 최초 연결
    connect();

    return () => {
      isCancelled = true;
      console.log("SSE 연결 종료:", sseUrl);
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [sseUrl]);

  const clearNotifications = () => {
    setNotifications([]);
    console.log("알림 초기화");
  };

  return { notifications, clearNotifications };
};

export default useNotifications;
