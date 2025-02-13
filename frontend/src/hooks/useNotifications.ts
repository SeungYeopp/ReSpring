import { useState, useEffect } from "react";
import type { Notification } from "@/app/notifications/types/notifications";
// export interface Notification {
//   message: string;
//   // 필요한 경우 id, timestamp 등 추가 필드를 정의할 수 있습니다.
// }

/**
 * useNotifications 커스텀 훅
 *
 * 이 훅은 SSE(Server-Sent Events)를 사용하여 지정된 URL로부터 알림 데이터를 받아옵니다.
 * 받아온 알림은 내부 상태에 저장되며, 컴포넌트에서 이를 활용할 수 있습니다.
 *
 * @param {string} sseUrl - 알림을 수신할 SSE 엔드포인트 URL
 * @returns {object} notifications: 현재까지 수신된 알림 배열, clearNotifications: 알림을 초기화하는 함수
 */
const useNotifications = (sseUrl: string) => {
  // 알림 데이터를 저장하는 상태입니다.
  // 새로운 알림이 도착할 때마다 배열에 추가됩니다.
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // SSE 연결은 클라이언트 측에서만 동작하므로, 브라우저 환경임을 확인할 수 있습니다.
    // (Next.js의 SSR 환경에서는 useEffect가 실행되지 않으므로 안전합니다.)

    // SSE 엔드포인트에 연결하기 위해 EventSource 인스턴스를 생성합니다.
    const eventSource = new EventSource(sseUrl);

    /**
     * SSE 'message' 이벤트 핸들러
     *
     * 서버로부터 수신한 메시지(event.data)는 문자열 형태입니다.
     * 일반적으로 JSON 포맷으로 전달되므로, 이를 파싱하여 알림 객체로 변환합니다.
     */
    const handleMessage = (event: MessageEvent) => {
      try {
        // event.data를 JSON으로 파싱합니다.
        const parsedData: Notification = JSON.parse(event.data);

        // 이전 알림 배열에 새로운 알림을 추가합니다.
        setNotifications((prevNotifications) => [...prevNotifications, parsedData]);
      } catch (error) {
        // 파싱에 실패하면 콘솔에 에러를 출력합니다.
        console.error("SSE 데이터 파싱 실패:", error);
      }
    };

    /**
     * SSE 'error' 이벤트 핸들러
     *
     * SSE 연결 중 에러가 발생하면 호출됩니다.
     * 네트워크 장애 등 다양한 원인이 있을 수 있으며,
     * 추가적인 에러 처리(예: 재연결 로직)를 구현할 수 있습니다.
     */
    const handleError = (error: any) => {
      console.error("SSE 연결 에러:", error);
      // 필요에 따라 재연결 로직 등을 추가할 수 있습니다.
    };

    // 'message'와 'error' 이벤트 리스너를 등록합니다.
    eventSource.addEventListener("message", handleMessage);
    eventSource.addEventListener("error", handleError);

    // 컴포넌트가 언마운트되거나 sseUrl이 변경되면 SSE 연결을 종료하여 메모리 누수를 방지합니다.
    return () => {
      eventSource.removeEventListener("message", handleMessage);
      eventSource.removeEventListener("error", handleError);
      eventSource.close();
    };
  }, [sseUrl]); // sseUrl이 변경되면 새로운 연결을 생성합니다.

  /**
   * 알림 상태를 초기화하는 함수
   *
   * 예를 들어, 사용자가 알림을 모두 읽었을 때 호출할 수 있습니다.
   */
  const clearNotifications = () => {
    setNotifications([]);
  };

  // 현재까지 수신된 알림 배열과 알림 초기화 함수를 반환합니다.
  return { notifications, clearNotifications };
};

export default useNotifications;
