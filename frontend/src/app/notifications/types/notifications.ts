// 예: src/types/notifications.ts
export type NotificationType = "COMMENT" | "LIKE" | "SUBSCRIBE" | "REPLY";
export type TargetType = "POST" | "BOOK" | "USER" | "COMMENT";

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
