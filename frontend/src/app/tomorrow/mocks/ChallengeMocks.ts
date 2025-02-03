// src/app/tomorrow/mocks/ChallengeMocks.ts
import { Challenge } from "@/app/tomorrow/types/challenge";

const mockChallenges: Challenge[] = [
  {
    id: 1,
    title: "30일 독서 챌린지",
    description: "매일 30분 독서를 목표로 하는 챌린지입니다.",
    image: "http://example.com/images/challenge1.jpg",
    registerDate: "2024-01-30T10:00:00",
    likes: 12,
    views: 150,
    participantCount: 30,
  },
  {
    id: 2,
    title: "매일 1만 보 걷기",
    description: "하루 1만 보 이상 걷기를 목표로 하는 챌린지입니다.",
    image: "http://example.com/images/challenge2.jpg",
    registerDate: "2024-02-01T10:00:00",
    likes: 25,
    views: 200,
    participantCount: 45,
  },
];

export default mockChallenges;
