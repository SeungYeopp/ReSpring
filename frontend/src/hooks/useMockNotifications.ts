// import { useState, useEffect } from "react";
// import type { Notification } from "@/app/notifications/types/notifications";
// import { mockNotifications } from "@/app/notifications/mocks/notifications";

// /**
//  * useMockNotifications 훅
//  *
//  * 이 훅은 실제 SSE 연결 대신, 미리 생성해둔 목데이터(mockNotifications)를
//  * 일정 시간 간격으로 순차적으로 상태에 추가하여 알림 UI를 테스트할 수 있도록 합니다.
//  *
//  * @returns {object} notifications: 현재까지 시뮬레이션된 알림 배열,
//  *                   clearNotifications: 알림을 초기화하는 함수
//  */
// const useMockNotifications = () => {
//   // 알림 데이터를 저장하는 상태입니다.
//   const [notifications, setNotifications] = useState<Notification[]>([]);

//   useEffect(() => {
//     let index = 0;
//     // setInterval을 이용하여 3초마다 목데이터에서 하나씩 추가합니다.
//     const interval = setInterval(() => {
//       if (index < mockNotifications.length) {
//         // 현재 인덱스의 목데이터를 상태에 추가합니다.
//         setNotifications((prev) => [...prev, mockNotifications[index]]);
//         index++;
//       } else {
//         // 모든 목데이터를 추가한 경우 타이머를 정리합니다.
//         clearInterval(interval);
//       }
//     }, 120000); // 120초 간격으로 알림 전달

//     return () => clearInterval(interval);
//   }, []);

//   /**
//    * 알림 상태를 초기화하는 함수
//    *
//    * 예를 들어, 사용자가 알림을 모두 확인한 경우 호출할 수 있습니다.
//    */
//   const clearNotifications = () => {
//     setNotifications([]);
//   };

//   return { notifications, clearNotifications };
// };

// export default useMockNotifications;
