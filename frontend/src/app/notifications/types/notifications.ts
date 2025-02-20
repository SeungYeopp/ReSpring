// 예: src/types/notifications.ts
export type TargetType = "POST" | "BOOK" | "USER" | "COMMENT";
export type NotificationType = "COMMENT" | "LIKE" | "SUBSCRIBE" | "REPLY" | "CHAT" | "CHALLENGE" | "FOLLOW";

export interface Notification {
  id: number;
  type: NotificationType;
  targetType: TargetType;
  targetId: number;
  message: string;
  createdAt: string;
  read: boolean;
  timeout?: number; // 선택
}
