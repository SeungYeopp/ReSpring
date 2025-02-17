// src/app/tomorrow/types/challenge.ts

// 📌 1. 기본 챌린지 정보 (목록 조회 & 검색 결과)
export interface Challenge {
  id: number;
  title: string;
  description: string;
  image: string;             // 기존 필드 그대로 사용
  registerDate: string;      // ISO 날짜 형식 ("YYYY-MM-DDTHH:mm:ss")
  likes: number;
  views: number;
  participantCount: number;
  status: "UPCOMING" | "ONGOING" | "ENDED"; // 상태값 업데이트
}

// 예시: Tag 타입 (필요에 따라 수정)
export interface Tag {
  id: number;
  name: string;
}

// 📌 2. 챌린지 상세 정보 (확장된 필드 포함)
export interface ChallengeDetail extends Challenge {
  startDate: string;         // 시작일 ("YYYY-MM-DDTHH:mm:ss")
  endDate: string;           // 종료일 ("YYYY-MM-DDTHH:mm:ss")
  tags: Tag[];               // 태그 목록 (Tag[] 타입)
  successToday: boolean;     // 오늘 성공 여부 (응답 예시: successToday)
  longestStreak: number;     // 최장 연속 성공 기록
  currentStreak: number;     // 현재 연속 성공 기록
  successRate: number;       // 성공률
  ownerId?: string;          // 챌린지 소유자 ID (옵션)
  records?: { [key: string]: "SUCCESS" | "FAIL" }; // 날짜별 성공/실패 기록 (옵션)
  isParticipating: boolean;  // 현재 사용자의 참여 여부 (응답 예시: Isparticipating → isParticipating)
  isLike: boolean;           // 사용자가 좋아요를 눌렀는지 여부 (응답 예시: Islike → isLike)
  imageUrl: string; // ✅ API로부터 오는 이미지 URL
}


// 📌 3. 내가 참여한 챌린지 목록
export interface ParticipatedChallenge {
  id: number;
  title: string;
  image: string;
  registerDate: string;
  tags: Tag[];
  tagCount: number;
  currentStreak: number;
}

export interface Tag {
  id: number;
  name: string;
}

// 📌 4. 챌린지 생성 요청 DTO
export interface ChallengeCreateRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  tags: string[];
  image?: File; // 📌 이미지 업로드 지원
}

// 📌 5. 챌린지 수정 요청 DTO (Owner만 가능)
export interface ChallengeUpdateRequest {
  description?: string;
  endDate?: string;
  ownerId: string;
  image?: File; // 📌 이미지 수정 가능
}

// // 📌 6. 챌린지 참여자 정보
// export interface ChallengeParticipant {
//   challengeId: number; // 📌 챌린지 ID 추가
//   participantCount: number;
//   participantIds: Participant[];
// }
export interface ChallengeParticipant {
  challengeId: number; // 챌린지 ID
  participantCount: number;
  participantInfos: Participant[];
}


// 📌 7. 챌린지 정렬 옵션 타입
export type SortOption = "LATEST" | "POPULAR" | "MOST_PARTICIPATED";

// 📌 8. 챌린지 정렬 옵션 배열 (UI에서 사용)
export const sortOptions: { label: string; value: SortOption }[] = [
  { label: "최신순", value: "LATEST" },
  { label: "인기순", value: "POPULAR" },
  { label: "참가자순", value: "MOST_PARTICIPATED" },
];

// 📌 9. 구독한 사용자의 챌린지 목록 조회 시 반환되는 챌린지 정보
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

// 📌 10. 내가 구독한 사용자 목록 조회 시 반환되는 사용자 정보
export interface SubscribedUser {
  id: string;
  nickname: string;
  email: string;
  profileImage: string;
  createdAt: string;
}

// 📌 챌린지 폼에 줘야 함.
export interface ChallengeFormProps {
  onSubmit: (data: CreateChallenge) => void; // Challenge → CreateChallenge로 수정
  onCancel: () => void;
}
// 📌 챌린지 프리뷰에 줘야 함.
export interface ChallengePreviewProps {
  title: string;
  description: string;
  tags: string[];
  startDate?: Date;
  endDate?: Date;
  preview?: string;
}
// 📌 챌린지 생성에 줘야 함.
export const MAX_TITLE_LENGTH = 15;
export const MIN_TITLE_LENGTH = 5;
export const MAX_DESCRIPTION_LENGTH = 50;
export const MIN_DESCRIPTION_LENGTH = 10;
export const MAX_TAGS = 5;

export interface CreateChallenge {
  title: string;
  description: string;
  tags: string[];
  startDate: Date;
  endDate: Date;
  image?: File;
  preview?: string; // preview 속성 추가
}

export interface Participant {
  userId: string;
  nickname: string;
  profileImage: string;
}
