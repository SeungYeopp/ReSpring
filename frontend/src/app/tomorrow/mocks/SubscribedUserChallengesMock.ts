import { SubscribedUserChallenge } from "@/app/tomorrow/types/challenge";

/** ✅ 랜덤 챌린지 이미지 생성 함수 */
const getRandomImage = () => {
  const imageNumber = Math.floor(Math.random() * 9) + 1; // 1~9 숫자 랜덤 선택
  return `/corgis/placeholder${imageNumber}.jpg`; // public 폴더 내 이미지 경로
};

const mockSubscribedUserChallenges: SubscribedUserChallenge[] = [
  {
    challengeId: 202,
    title: "30일 코딩 챌린지",
    description: "매일 1시간 이상 코딩하기",
    image: getRandomImage(),
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
    image: getRandomImage(),
    registerDate: "2024-01-15T12:00:00",
    likes: 80,
    views: 300,
    participantCount: 15,
    ownerId: "a12b7c3d-d887-11ef-b310-d4f32d147183",
    ownerName: "김철수",
  },
  {
    challengeId: 204,
    title: "홈트레이닝 챌린지",
    description: "집에서 간단한 운동으로 건강 유지하기",
    image: getRandomImage(),
    registerDate: "2024-02-05T10:00:00",
    likes: 65,
    views: 280,
    participantCount: 18,
    ownerId: "c34d8e9f-d887-11ef-b310-d4f32d147183",
    ownerName: "박민수",
  },
  {
    challengeId: 205,
    title: "비건 식단 챌린지",
    description: "매일 비건 식단으로 건강 관리하기",
    image: getRandomImage(),
    registerDate: "2024-02-20T14:30:00",
    likes: 90,
    views: 350,
    participantCount: 22,
    ownerId: "d45e9fa0-d887-11ef-b310-d4f32d147183",
    ownerName: "최수진",
  },
];

export default mockSubscribedUserChallenges;
