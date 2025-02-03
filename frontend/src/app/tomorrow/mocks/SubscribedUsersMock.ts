// src/app/tomorrow/mocks/SubscribedUsersMock.ts
import { SubscribedUser } from "@/app/tomorrow/types/challenge";

const mockSubscribedUsers: SubscribedUser[] = [
  {
    id: "a12b7c3d-d887-11ef-b310-d4f32d147183",
    nickname: "개발자123",
    email: "developer123@example.com",
    profileImage: "https://example.com/profile1.jpg",
    createdAt: "2023-12-10T15:30:00",
  },
  {
    id: "b23c8d4e-d887-11ef-b310-d4f32d147183",
    nickname: "TechGuru",
    email: "techguru@example.com",
    profileImage: "https://example.com/profile2.jpg",
    createdAt: "2023-11-05T10:15:00",
  },
];

export default mockSubscribedUsers;
