// src/app/tomorrow/mocks/ChallengeDetailMock.ts
import { ChallengeDetail } from "@/app/tomorrow/types/challenge";

const mockChallengeDetail: ChallengeDetail = {
  id: 1,
  title: "30일 독서 챌린지",
  description: "매일 30분 독서를 목표로 하는 챌린지입니다. 김민철 바보",
  image: "http://example.com/images/challenge1.jpg",
  registerDate: "2024-01-30T10:00:00",
  startDate: "2024-02-01T00:00:00",
  endDate: "2024-02-28T23:59:59",
  tags: ["독서", "습관", "성장"],
  participantCount: 30,
  likes: 12,
  views: 150,
  isSuccessToday: true,
  longestStreak: 15,
  currentStreak: 5,
  successRate: 90.5,
};

export default mockChallengeDetail;
