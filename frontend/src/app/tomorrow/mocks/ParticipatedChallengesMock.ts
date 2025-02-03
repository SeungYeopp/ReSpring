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
  {
    id: 3,
    title: "영어 단어 암기 챌린지",
    image: "http://example.com/images/challenge3.jpg",
    registerDate: "2024-02-10T09:00:00",
    tags: ["영어", "암기", "어학"],
    tagCount: 3,
    currentStreak: 7,
  },
  {
    id: 4,
    title: "요가 챌린지",
    image: "http://example.com/images/challenge4.jpg",
    registerDate: "2024-03-05T08:30:00",
    tags: ["요가", "건강", "스트레칭"],
    tagCount: 3,
    currentStreak: 12,
  },
  {
    id: 5,
    title: "러닝 챌린지",
    image: "http://example.com/images/challenge5.jpg",
    registerDate: "2024-03-20T07:45:00",
    tags: ["러닝", "체력", "건강"],
    tagCount: 3,
    currentStreak: 9,
  },
];

export default mockParticipatedChallenges;
