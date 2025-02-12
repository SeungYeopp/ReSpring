import type { Notification } from "../types/notifications";

// id에 따른 생성일자를 반환하는 헬퍼 함수 (기준 시각에서 15분씩 차감)
function getCreatedAt(id: number): string {
  const baseDate = new Date("2025-02-12T01:07:53.107Z");
  const minutesToSubtract = (id - 1) * 15; // 각 알림마다 15분씩 차감
  baseDate.setMinutes(baseDate.getMinutes() - minutesToSubtract);
  return baseDate.toISOString();
}

// 알림 타입과 대상에 따른 메시지 생성 함수
function getMessage(type: Notification["type"], targetType: Notification["targetType"], id: number): string {
  const userNumber = id + 1; // 기존 예시와 같이 testuser 번호는 id+1
  switch (type) {
    case "COMMENT":
      return `testuser${userNumber}님이 당신의 ${targetType === "POST" ? "게시글" : "자서전"}에 댓글을 남겼습니다.`;
    case "LIKE":
      return `testuser${userNumber}님이 당신의 ${targetType === "POST" ? "게시글" : "자서전"}에 좋아요를 눌렀습니다.`;
    case "SUBSCRIBE":
      return `testuser${userNumber}님이 당신을 구독하기 시작했습니다.`;
    case "REPLY":
      return `testuser${userNumber}님이 당신의 댓글에 대댓글을 남겼습니다.`;
    default:
      return "";
  }
}

// 사용할 알림 타입 목록 (순차적으로 반복)
const types: Notification["type"][] = ["COMMENT", "LIKE", "SUBSCRIBE", "REPLY"];

// 100개의 알림 데이터를 생성
export const mockNotifications: Notification[] = Array.from({ length: 100 }, (_, i) => {
  const id = i + 1;
  const type = types[i % types.length]; // 4종류의 타입을 순환 적용
  let targetType: Notification["targetType"];

  // 타입에 따른 targetType 지정
  switch (type) {
    case "COMMENT":
      // 예시: 홀수 id는 "POST", 짝수 id는 "BOOK"
      targetType = id % 2 === 1 ? "POST" : "BOOK";
      break;
    case "LIKE":
      // 예시: 홀수 id는 "POST", 짝수 id는 "BOOK"
      targetType = id % 2 === 1 ? "POST" : "BOOK";
      break;
    case "SUBSCRIBE":
      targetType = "USER";
      break;
    case "REPLY":
      targetType = "COMMENT";
      break;
    default:
      targetType = "POST";
  }

  return {
    id,
    type,
    targetType,
    targetId: id * 101, // id 1 → 101, id 2 → 202, ...
    message: getMessage(type, targetType, id),
    createdAt: getCreatedAt(id),
    read: id % 2 === 0, // 짝수 id는 읽은 상태(true)로 설정
  };
});
