// src/app/tomorrow/mocks/SubscribedUserChallengesMock.ts
import { SubscribedUserChallenge } from "@/app/tomorrow/types/challenge";

const mockSubscribedUserChallenges: SubscribedUserChallenge[] = [
  {
    challengeId: 202,
    title: "30일 코딩 챌린지",
    description: "매일 1시간 이상 코딩하기",
    image: "https://example.com/challenge.jpg",
    registerDate: "2024-01-20T08:00:00",
    likes: 100,
    views: 500,
    participantCount: 20,
    ownerId: "f23a7b3c-d887-11ef-b310-d4f32d147183",
    ownerName: "이영희",
  },
  {
    challengeId: 203,
    title: "명상 챌린지",
    description: "매일 10분 명상하기",
    image: "https://example.com/challenge2.jpg",
    registerDate: "2024-01-15T12:00:00",
    likes: 80,
    views: 300,
    participantCount: 15,
    ownerId: "a12b7c3d-d887-11ef-b310-d4f32d147183",
    ownerName: "김철수",
  },
];

export default mockSubscribedUserChallenges;
