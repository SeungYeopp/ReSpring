import type { ChallengeDetail } from "../types/challenge";

export const mockChallengeData: ChallengeDetail = {
  id: 1,
  title: "30일 아침 조깅 챌린지",
  description: "매일 아침 6시에 일어나 5km 조깅하기!",
  image: "/images/jogging.png",
  registerDate: "2024-05-01T08:00:00",
  likes: 150,
  views: 1200,
  participantCount: 300,
  status: "ONGOING",
  startDate: "2024-05-01T06:00:00",
  endDate: "2024-05-31T06:00:00",
  tags: ["운동", "건강", "조깅"],
  isSuccessToday: false,
  longestStreak: 15,
  currentStreak: 5,
  successRate: 75,
  // chatRoomUUID: "abcd-1234-efgh-5678", // 제거
};
