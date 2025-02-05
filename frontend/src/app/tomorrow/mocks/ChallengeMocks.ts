// src/app/tomorrow/mocks/ChallengeMocks.ts
import { Challenge } from "@/app/tomorrow/types/challenge";

/** ✅ 랜덤 챌린지 이미지 생성 함수 */
const getRandomImage = () => {
  const imageNumber = Math.floor(Math.random() * 9) + 1; // 1~9 숫자 랜덤 선택
  return `/corgis/placeholder${imageNumber}.jpg`; // public 폴더 내 이미지 경로
};

/** ✅ 현재 날짜를 기준으로 챌린지 상태 계산 함수 */
const getChallengeStatus = (startDate: string, endDate: string): "UPCOMING" | "ONGOING" | "ENDED" => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return "UPCOMING";
  if (now > end) return "ENDED";
  return "ONGOING";
};

const mockChallenges: Challenge[] = [
  {
    id: 1,
    title: "30일 독서 챌린지",
    description: "매일 30분 독서를 목표로 하는 챌린지입니다.",
    image: getRandomImage(),
    registerDate: "2024-01-30T10:00:00",
    likes: 12,
    views: 150,
    participantCount: 30,
    status: getChallengeStatus("2024-02-01T00:00:00", "2024-02-28T23:59:59"),
  },
  {
    id: 2,
    title: "매일 1만 보 걷기",
    description: "하루 1만 보 이상 걷기를 목표로 하는 챌린지입니다.",
    image: getRandomImage(),
    registerDate: "2024-02-01T10:00:00",
    likes: 25,
    views: 200,
    participantCount: 45,
    status: getChallengeStatus("2024-03-01T00:00:00", "2024-03-31T23:59:59"),
  },
  {
    id: 3,
    title: "매일 영어 단어 암기",
    description: "하루에 20개의 영어 단어를 암기하는 챌린지입니다.",
    image: getRandomImage(),
    registerDate: "2024-02-05T09:30:00",
    likes: 20,
    views: 220,
    participantCount: 45,
    status: getChallengeStatus("2024-03-10T00:00:00", "2024-04-09T23:59:59"),
  },
  {
    id: 4,
    title: "요가 챌린지",
    description: "매일 아침 요가로 몸과 마음을 단련하는 챌린지입니다.",
    image: getRandomImage(),
    registerDate: "2024-03-01T08:00:00",
    likes: 35,
    views: 300,
    participantCount: 60,
    status: getChallengeStatus("2024-04-01T00:00:00", "2024-04-30T23:59:59"),
  },
  {
    id: 5,
    title: "러닝 챌린지",
    description: "매일 5km 달리기를 통해 체력을 단련하는 챌린지입니다.",
    image: getRandomImage(),
    registerDate: "2024-03-10T12:00:00",
    likes: 50,
    views: 500,
    participantCount: 80,
    status: getChallengeStatus("2024-05-01T00:00:00", "2024-05-31T23:59:59"),
  },
  {
    id: 6,
    title: "물 마시기 챌린지",
    description: "하루 2리터의 물을 마시며 건강을 챙기는 챌린지입니다.",
    image: getRandomImage(),
    registerDate: "2024-04-01T07:00:00",
    likes: 40,
    views: 350,
    participantCount: 100,
    status: getChallengeStatus("2024-06-01T00:00:00", "2024-06-30T23:59:59"),
  },
  {
    id: 7,
    title: "명상 챌린지",
    description: "매일 10분 명상으로 마음의 평화를 찾는 챌린지입니다.",
    image: getRandomImage(),
    registerDate: "2024-04-10T06:30:00",
    likes: 18,
    views: 180,
    participantCount: 55,
    status: getChallengeStatus("2024-07-01T00:00:00", "2024-07-31T23:59:59"),
  },
  {
    id: 8,
    title: "홈트레이닝 챌린지",
    description: "매일 집에서 간단한 운동으로 건강을 유지하는 챌린지입니다.",
    image: getRandomImage(),
    registerDate: "2024-04-15T11:00:00",
    likes: 22,
    views: 210,
    participantCount: 65,
    status: getChallengeStatus("2024-08-01T00:00:00", "2024-08-31T23:59:59"),
  },
  {
    id: 9,
    title: "비건 식단 챌린지",
    description: "매일 비건 식단으로 건강을 돌보는 챌린지입니다.",
    image: getRandomImage(),
    registerDate: "2024-04-20T14:00:00",
    likes: 30,
    views: 270,
    participantCount: 70,
    status: getChallengeStatus("2024-09-01T00:00:00", "2024-09-30T23:59:59"),
  },
  {
    id: 10,
    title: "일일 일기 작성 챌린지",
    description: "매일 일기를 작성하며 자기 성찰을 돕는 챌린지입니다.",
    image: getRandomImage(),
    registerDate: "2024-04-25T09:00:00",
    likes: 15,
    views: 160,
    participantCount: 40,
    status: getChallengeStatus("2024-10-01T00:00:00", "2024-10-31T23:59:59"),
  },
];

export default mockChallenges;
