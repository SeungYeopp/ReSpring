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
      console.log("SSE 연결 시작:", sseUrl);
      const eventSource = new EventSource(sseUrl);
      eventSourceRef.current = eventSource;

      // 🔵 "notification" 이벤트 핸들러
      const handleNotification = (event: MessageEvent) => {
        console.log("SSE [notification] 이벤트 발생:", event);
        try {
          const parsedData: Notification = JSON.parse(event.data);
          console.log("SSE 데이터 파싱 성공:", parsedData);
          setNotifications((prev) => [...prev, parsedData]);
        } catch (error) {
          console.error("SSE 데이터 파싱 실패:", error);
        }
      };

      // 🟢 "connect" 이벤트 핸들러
      const handleConnect = (event: MessageEvent) => {
        console.log("SSE [connect] 이벤트 발생:", event.data);
      };

      // 🔴 "error" 이벤트 핸들러 (연결 끊김 시 재연결)
      const handleError = (error: any) => {
        console.error("SSE 연결 에러 발생:", error);
        eventSource.close();

        if (!isCancelled) {
          console.log("SSE 재연결 시도 예정 (3초 후)");
          retryTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000);
        }
      };

      // 이벤트 리스너 등록 (이벤트별 핸들러 설정)
      eventSource.addEventListener("notification", handleNotification);
      eventSource.addEventListener("connect", handleConnect);
      eventSource.addEventListener("error", handleError);

      // 클린업 함수 - 언마운트 시 연결 종료 및 재연결 중단
      return () => {
        eventSource.removeEventListener("notification", handleNotification);
        eventSource.removeEventListener("connect", handleConnect);
        eventSource.removeEventListener("error", handleError);
        eventSource.close();
      };
    };

    // 최초 SSE 연결 시도
    const cleanup = connect();

    // 언마운트 시 정리
    return () => {
      isCancelled = true;
      console.log("SSE 연결 종료 및 재연결 중단:", sseUrl);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      if (eventSourceRef.current) eventSourceRef.current.close();

      // 현재 이벤트 리스너도 제거 (위에서 반환된 cleanup 실행)
      cleanup();
    };
  }, [sseUrl]);

  const clearNotifications = () => {
    setNotifications([]);
    console.log("알림 초기화");
  };

  return { notifications, clearNotifications };
};

export default useNotifications;
