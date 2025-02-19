import { ParticipatedChallenge } from "@/app/tomorrow/types/challenge";

/**   랜덤 챌린지 이미지 생성 함수 */
const getRandomImage = () => {
  const imageNumber = Math.floor(Math.random() * 9) + 1; // 1~9 숫자 랜덤 선택
  return `/corgis/placeholder${imageNumber}.jpg`; // public 폴더 내 이미지 경로
};

const mockParticipatedChallenges: ParticipatedChallenge[] = [
  {
    id: 1,
    title: "30일 독서 챌린지",
    image: getRandomImage(),
    registerDate: "2024-01-30T10:00:00",
    tags: [
      { id: 1, name: "독서" },
      { id: 2, name: "습관" },
      { id: 3, name: "성장" }
    ],
    tagCount: 3, //   tagCount 추가
    currentStreak: 5,
  },
  {
    id: 2,
    title: "하루 1만 보 걷기",
    image: getRandomImage(),
    registerDate: "2024-02-01T10:00:00",
    tags: [
      { id: 1, name: "운동" },
      { id: 2, name: "건강" },
      { id: 3, name: "습관관" }
    ],
    tagCount: 3,
    currentStreak: 10,
  },
  {
    id: 3,
    title: "영어 단어 암기 챌린지",
    image: getRandomImage(),
    registerDate: "2024-02-10T09:00:00",
    tags: [
      { id: 1, name: "영어" },
      { id: 2, name: "암기" },
      { id: 3, name: "어학학" }
    ],
    tagCount: 3,
    currentStreak: 7,
  },
  {
    id: 4,
    title: "요가 챌린지",
    image: getRandomImage(),
    registerDate: "2024-03-05T08:30:00",
    tags: [
      { id: 1, name: "요가" },
      { id: 2, name: "건강" },
      { id: 3, name: "스트레칭칭" }
    ],
    tagCount: 3,
    currentStreak: 12,
  },
  {
    id: 5,
    title: "러닝 챌린지",
    image: getRandomImage(),
    registerDate: "2024-03-20T07:45:00",
    tags: [
      { id: 1, name: "러닝" },
      { id: 2, name: "체력" },
      { id: 3, name: "건강강" }
    ],
    tagCount: 3,
    currentStreak: 9,
  },
];

export default mockParticipatedChallenges;
