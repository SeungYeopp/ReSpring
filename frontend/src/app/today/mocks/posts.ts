import type { Post } from "../types/posts"

// 인기 게시글 목데이터
export const popularPosts: Post[] = [
  {
    id: "1",
    author: {
      id: "1",
      name: "실버맨",
      profileImage: "/placeholder.svg",
    },
    title: "퇴직금 제대로 관리하기: 재테크 노하우 공유",
    content:
      "안녕하세요. 실버맨입니다. 오늘은 더 나은 노하우가 있으시면 공유받길 바라며 제가 퇴직금을 관리하는 방법에 대해 이야기하고자 합니다....",
    category: "정보공유",
    createdAt: "2024-01-24T12:00:00Z",
    likes: 19,
    comments: 3,
    isPopular: true,
  },
  // ... 더 많은 인기 게시글
]

// 일반 게시글 목데이터
export const posts: Post[] = [
  {
    id: "2",
    author: {
      id: "2",
      name: "뉴비",
      profileImage: "/placeholder.svg",
      generation: "제2인생 뉴비",
    },
    title: "다들 무슨 취미를 갖고 계신가요?",
    content:
      "안녕하세요. 퇴직한지 4개월차가 되어가는 뉴비입니다. 특히 요즘 건강과 관련해서 스포츠를 알아보고 있는데...",
    category: "고민/질문",
    createdAt: "2024-01-24T10:00:00Z",
    likes: 12,
    comments: 3,
  },
  // ... 더 많은 일반 게시글
]

