// /lib/mocks/followedChallenges.ts

export interface FollowedChallenge {
  challenge_id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  image_url: string;
  user_name: string;
  user_image: string;
}

export const mockFollowedChallenges: FollowedChallenge[] = [
  {
    challenge_id: 101,
    title: "매일 아침 조깅하기",
    description: "하루를 상쾌하게 시작하는 방법!",
    start_date: "2024-02-01T00:00:00Z",
    end_date: "2024-02-29T00:00:00Z",
    image_url: "/placeholder.webp",
    user_name: "건강이",
    user_image: "/placeholder.webp",
  },
  {
    challenge_id: 102,
    title: "1일 1식물 그리기",
    description: "매일 다른 식물을 관찰하고 그려보세요.",
    start_date: "2024-02-05T00:00:00Z",
    end_date: null,
    image_url: "/placeholder.webp",
    user_name: "그림쟁이",
    user_image: "/placeholder.webp",
  },
  {
    challenge_id: 103,
    title: "새 언어 배우기",
    description: "30일 동안 매일 스페인어 공부하기",
    start_date: "2024-01-15T00:00:00Z",
    end_date: "2024-02-13T00:00:00Z",
    image_url: "/placeholder.webp",
    user_name: "언어천재",
    user_image: "/placeholder.webp",
  },
];
