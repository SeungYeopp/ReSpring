// src/app/tomorrow/types/challenge.ts

// 📌 1. 기본 챌린지 정보 (목록 조회 & 검색 결과)
export interface Challenge {
  id: number;
  title: string;
  description: string;
  image: string;
  registerDate: string; // ISO 날짜 형식 ("YYYY-MM-DDTHH:mm:ss")
  likes: number;
  views: number;
  participantCount: number;
}

// 📌 2. 챌린지 상세 정보
export interface ChallengeDetail extends Challenge {
  startDate: string; // 시작일 ("YYYY-MM-DDTHH:mm:ss")
  endDate: string; // 종료일 ("YYYY-MM-DDTHH:mm:ss")
  tags: string[];
  isSuccessToday: boolean;
  longestStreak: number;
  currentStreak: number;
  successRate: number;
}

// 📌 3. 내가 참여한 챌린지 목록
export interface ParticipatedChallenge {
  id: number;
  title: string;
  image: string;
  registerDate: string;
  tags: string[];
  tagCount: number;
  currentStreak: number;
}

// 📌 4. 챌린지 생성 요청 DTO
export interface ChallengeCreateRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  tags: string[];
  ownerId: string; // UUID 형식
}

// 📌 5. 챌린지 수정 요청 DTO (Owner만 가능)
export interface ChallengeUpdateRequest {
  description?: string;
  endDate?: string;
  ownerId: string;
}

// 📌 6. 챌린지 참여자 정보
export interface ChallengeParticipant {
  participantCount: number;
  participantIds: string[];
}

// 📌 7. 구독한 사용자 목록 조회 시 반환되는 사용자 정보

export interface SubscribedUser {
  id: string;
  nickname: string;
  email: string;
  profileImage: string;
  createdAt: string;
}

// 📌 8. 구독한 사용자의 챌린지 목록 조회 시 반환되는 챌린지 정보
export interface SubscribedUserChallenge {
  challengeId: number;
  title: string;
  description: string;
  image: string;
  registerDate: string;
  likes: number;
  views: number;
  participantCount: number;
  ownerId: string;
  ownerName: string;
}

// 정렬 옵션 타입 추가
export type SortOption = "likes" | "views" | "participants" | "recent";

// 정렬 옵션 배열 추가 ✅
export const sortOptions: { label: string; value: SortOption }[] = [
  { label: "인기순", value: "likes" },
  { label: "조회순", value: "views" },
  { label: "참가자순", value: "participants" },
  { label: "최신순", value: "recent" },
];
