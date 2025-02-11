export interface OpenChatMessage {
  id: string;
  userId: string;
  nickname: string;
  content: string;
  timestamp: string;
}

export interface OpenChatUser {
  userId: string;
  nickname: string;
  profileImage: string;
  isOnline: boolean;
}
