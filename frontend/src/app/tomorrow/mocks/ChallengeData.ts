import type { ChallengeDetail } from "../types/challenge";

// 📌 챌린지 상세 정보 목데이터
export const mockChallengeData: ChallengeDetail = {
  id: 1,
  title: "30일 독서 챌린지",
  description: "매일 30분 독서를 목표로 하는 챌린지입니다.",
  image: "http://example.com/images/challenge1.jpg",
  imageUrl: "http://example.com/images/challenge1.jpg",
  registerDate: "2024-01-15T09:00:00",
  likes: 50,
  views: 500,
  participantCount: 100,
  status: "ONGOING",

  // 상세 정보
  startDate: "2024-02-01T00:00:00",
  endDate: "2024-02-28T23:59:59",
  tags: [
    {id: 1, name: "독서"}, 
    {id: 2, name: "습관"},
    {id: 3, name: "성장"},
  ],
  isSuccessToday: true,
  longestStreak: 15,
  currentStreak: 5,
  successRate: 90.5,

  // 소유자 정보 (API 응답 포함 가정)
  ownerId: "abcd-1234-efgh-5678",
};
