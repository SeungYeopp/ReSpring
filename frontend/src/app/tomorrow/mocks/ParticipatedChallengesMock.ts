// src/app/tomorrow/mocks/ParticipatedChallengesMock.ts
import { ParticipatedChallenge } from "@/app/tomorrow/types/challenge";

const mockParticipatedChallenges: ParticipatedChallenge[] = [
  {
    id: 1,
    title: "30일 독서 챌린지",
    image: "http://example.com/images/challenge1.jpg",
    registerDate: "2024-01-30T10:00:00",
    tags: ["독서", "습관", "성장"],
    tagCount: 3,
    currentStreak: 5,
  },
  {
    id: 2,
    title: "하루 1만 보 걷기",
    image: "http://example.com/images/challenge2.jpg",
    registerDate: "2024-02-01T10:00:00",
    tags: ["운동", "건강", "습관"],
    tagCount: 3,
    currentStreak: 10,
  },
];

export default mockParticipatedChallenges;
