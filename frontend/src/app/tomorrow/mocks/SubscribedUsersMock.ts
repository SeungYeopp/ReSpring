import { SubscribedUser } from "@/app/tomorrow/types/challenge";

/** ✅ 랜덤 프로필 이미지 생성 함수 */
const getRandomImage = () => {
  const imageNumber = Math.floor(Math.random() * 9) + 1; // 1~9 숫자 랜덤 선택
  return `/corgis/placeholder${imageNumber}.jpg`; // public 폴더 내 이미지 경로
};

const mockSubscribedUsers: SubscribedUser[] = [
  {
    id: "a12b7c3d-d887-11ef-b310-d4f32d147183",
    nickname: "개발자123",
    email: "developer123@example.com",
    profileImage: getRandomImage(), // ✅ 랜덤 이미지 적용
    createdAt: "2023-12-10T15:30:00",
  },
  {
    id: "b23c8d4e-d887-11ef-b310-d4f32d147183",
    nickname: "TechGuru",
    email: "techguru@example.com",
    profileImage: getRandomImage(),
    createdAt: "2023-11-05T10:15:00",
  },
  {
    id: "c34d9e5f-d887-11ef-b310-d4f32d147183",
    nickname: "코딩러버",
    email: "coderlover@example.com",
    profileImage: getRandomImage(),
    createdAt: "2024-01-12T11:45:00",
  },
  {
    id: "d45eaf6a-d887-11ef-b310-d4f32d147183",
    nickname: "문제해결사",
    email: "solver@example.com",
    profileImage: getRandomImage(),
    createdAt: "2024-02-02T09:20:00",
  },
  {
    id: "e56fb07b-d887-11ef-b310-d4f32d147183",
    nickname: "아이디어뱅크",
    email: "ideabank@example.com",
    profileImage: getRandomImage(),
    createdAt: "2024-03-08T16:10:00",
  },
];

export default mockSubscribedUsers;
