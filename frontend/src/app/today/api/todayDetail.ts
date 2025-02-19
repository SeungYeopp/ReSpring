/**
 * 오늘(커뮤니티) 섹션 관련 API (게시글 + 댓글)
 * Mock과 Real 함수를 한 파일에서 관리하며,
 * useMock 값에 따라 동작을 전환합니다.
 */

// =========================================
// 1. 게시글 & 댓글에 사용할 타입 정의 (예시)
// =========================================
export type Image = {
  imageId: number;
  imageUrl: string;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  category: string; // 예: INFORMATION_SHARING
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  likeByMe: boolean; // 추가된 속성
  images: Image[];
};

export type Comment = {
  id: number;
  content: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  parentId: number | null;
};
const mockPosts: Post[] = [
  {
    id: 1,
    title: "퇴직 후 새로운 삶의 시작",
    content: `안녕하세요, 여러분. 저는 30년간 한 회사에서 근무하다 얼마 전 퇴직한 김민철입니다. 
퇴직 후 처음에는 무엇을 해야 할지 막막했습니다. 하지만 이제는 새로운 삶의 장을 열어가는 중입니다.

첫째, 건강 관리에 신경 쓰고 있습니다. 매일 아침 공원을 산책하고, 주 3회 수영을 하고 있어요. 
둘째, 평소 관심 있던 원예를 배우고 있습니다. 작은 텃밭을 가꾸는 재미가 쏠쏠하네요.
셋째, 손주들과 더 많은 시간을 보내고 있습니다. 그들과 함께 있으면 젊어지는 기분이에요.

퇴직이 끝이 아니라 새로운 시작임을 깨달았습니다. 여러분도 각자의 인생 2막을 멋지게 준비하시기 바랍니다.

ps. 첨부한 사진은 제가 가꾸고 있는 작은 정원입니다. 어떠신가요?`,
    category: "LIFE_STORY",
    userId: "user123",
    userName: "김민철",
    createdAt: "2023-06-15T10:00:00",
    updatedAt: "2023-06-15T10:00:00",
    likes: 128,
    likeByMe: false,
    images: [
      {
        imageId: 101,
        imageUrl: "/placeholder.webp", //   내부 이미지 경로로 변경
      },
      {
        imageId: 102,
        imageUrl: "/placeholder.webp",
      },
      {
        imageId: 103,
        imageUrl: "/placeholder.webp",
      },
      {
        imageId: 104,
        imageUrl: "/placeholder.webp",
      },
      {
        imageId: 105,
        imageUrl: "/placeholder.webp",
      },
      {
        imageId: 106,
        imageUrl: "/placeholder.webp",
      },
    ],
  },
];

// 댓글은 별도 배열로 관리하거나, 필요하다면 `mockPosts` 각각에 comments를 넣을 수도 있습니다.
const mockComments: Comment[] = [
  {
    id: 1001,
    content: "정말 멋진 정원이네요! 저도 퇴직 후 원예를 배워보고 싶어요.",
    username: "원예초보",
    createdAt: "2023-06-15T14:30:00",
    updatedAt: "2023-06-15T14:30:00",
    parentId: null,
  },
  {
    id: 1002,
    content: "건강관리 팁 좀 더 자세히 알려주세요!",
    username: "헬스매니아",
    createdAt: "2023-06-15T15:45:00",
    updatedAt: "2023-06-15T15:45:00",
    parentId: null,
  },
  {
    id: 1003,
    content: "손주들과 보내는 시간이 정말 소중해 보여요. 부럽습니다 ^^",
    username: "행복한할머니",
    createdAt: "2023-06-15T16:20:00",
    updatedAt: "2023-06-15T16:20:00",
    parentId: null,
  },
  {
    id: 1004,
    content: "퇴직 후의 삶에 대해 좋은 인사이트를 얻었습니다. 감사합니다!",
    username: "미래준비",
    createdAt: "2023-06-15T17:10:00",
    updatedAt: "2023-06-15T17:10:00",
    parentId: null,
  },
  {
    id: 1005,
    content: "저도 텃밭을 가꾸고 있는데, 토마토 기르기 팁 좀 알려주세요!",
    username: "토마토러버",
    createdAt: "2023-06-15T18:05:00",
    updatedAt: "2023-06-15T18:05:00",
    parentId: null,
  },
  {
    id: 1006,
    content: "퇴직 후의 재정 관리에 대해서도 이야기해주시면 좋겠어요.",
    username: "경제전문가",
    createdAt: "2023-06-15T19:30:00",
    updatedAt: "2023-06-15T19:30:00",
    parentId: null,
  },
  {
    id: 1007,
    content: "정원 사진이 정말 아름답습니다. 어떤 꽃들을 심으셨나요?",
    username: "꽃사랑",
    createdAt: "2023-06-15T20:15:00",
    updatedAt: "2023-06-15T20:15:00",
    parentId: null,
  },
  {
    id: 1008,
    content: "수영이 건강에 정말 좋죠. 저도 시작해볼까 고민 중입니다.",
    username: "운동초보",
    createdAt: "2023-06-15T21:00:00",
    updatedAt: "2023-06-15T21:00:00",
    parentId: null,
  },
  {
    id: 1009,
    content: "손주들과 어떤 활동을 주로 하시나요? 아이디어가 필요해요!",
    username: "젊은할아버지",
    createdAt: "2023-06-15T22:20:00",
    updatedAt: "2023-06-15T22:20:00",
    parentId: null,
  },
  {
    id: 1010,
    content: "퇴직 후 새로운 도전, 정말 멋집니다. 응원합니다!",
    username: "인생2막",
    createdAt: "2023-06-16T09:10:00",
    updatedAt: "2023-06-16T09:10:00",
    parentId: null,
  },
  {
    id: 1011,
    content: "맞아요, 토마토는 물 조절이 중요해요. 저는 일주일에 두 번 정도 듬뿍 줍니다.",
    username: "김민철",
    createdAt: "2023-06-16T10:30:00",
    updatedAt: "2023-06-16T10:30:00",
    parentId: 1005,
  },
  {
    id: 1012,
    content: "재정 관리는 정말 중요한 주제네요. 나중에 따로 포스트로 다뤄볼게요!",
    username: "김민철",
    createdAt: "2023-06-16T11:15:00",
    updatedAt: "2023-06-16T11:15:00",
    parentId: 1006,
  },
  {
    id: 1013,
    content: "주로 장미, 백일홍, 메리골드를 심었어요. 관리하기 비교적 쉬운 꽃들이죠.",
    username: "김민철",
    createdAt: "2023-06-16T12:00:00",
    updatedAt: "2023-06-16T12:00:00",
    parentId: 1007,
  },
  {
    id: 1014,
    content: "수영 정말 추천드려요! 처음엔 어렵지만 곧 익숙해지실 거예요.",
    username: "김민철",
    createdAt: "2023-06-16T13:20:00",
    updatedAt: "2023-06-16T13:20:00",
    parentId: 1008,
  },
  {
    id: 1015,
    content: "보드게임이나 간단한 요리를 같이 해요. 아이들이 정말 좋아하더라고요!",
    username: "김민철",
    createdAt: "2023-06-16T14:10:00",
    updatedAt: "2023-06-16T14:10:00",
    parentId: 1009,
  },
  {
    id: 1016,
    content: "와우, 정말 다양한 활동을 하고 계시네요. 대단합니다!",
    username: "활기찬인생",
    createdAt: "2023-06-16T15:30:00",
    updatedAt: "2023-06-16T15:30:00",
    parentId: null,
  },
  {
    id: 1017,
    content: "퇴직 후의 삶에 대해 긍정적인 시각을 가질 수 있어 좋았어요.",
    username: "긍정에너지",
    createdAt: "2023-06-16T16:45:00",
    updatedAt: "2023-06-16T16:45:00",
    parentId: null,
  },
  {
    id: 1018,
    content: "혹시 동네 주민들과 함께하는 활동도 있나요?",
    username: "이웃사촌",
    createdAt: "2023-06-16T17:55:00",
    updatedAt: "2023-06-16T17:55:00",
    parentId: null,
  },
  {
    id: 1019,
    content: "네, 주말마다 동네 공원에서 태극권을 함께 해요. 참여해보세요!",
    username: "김민철",
    createdAt: "2023-06-16T18:30:00",
    updatedAt: "2023-06-16T18:30:00",
    parentId: 1018,
  },
  {
    id: 1020,
    content: "퇴직 후 새로운 취미를 찾는 게 쉽지 않은데, 좋은 본보기가 되네요.",
    username: "취미탐험가",
    createdAt: "2023-06-16T19:20:00",
    updatedAt: "2023-06-16T19:20:00",
    parentId: null,
  },
  {
    id: 1021,
    content: "건강관리에 대해 더 자세히 알고 싶어요. 식단 관리는 어떻게 하시나요?",
    username: "건강지킴이",
    createdAt: "2023-06-16T20:10:00",
    updatedAt: "2023-06-16T20:10:00",
    parentId: null,
  },
  {
    id: 1022,
    content: "채식 위주의 식단을 유지하고 있어요. 과일과 채소를 많이 먹으려고 해요.",
    username: "김민철",
    createdAt: "2023-06-16T21:00:00",
    updatedAt: "2023-06-16T21:00:00",
    parentId: 1021,
  },
  {
    id: 1023,
    content: "정원 가꾸기가 스트레스 해소에 도움이 되나요?",
    username: "마음치유",
    createdAt: "2023-06-16T22:15:00",
    updatedAt: "2023-06-16T22:15:00",
    parentId: null,
  },
  {
    id: 1024,
    content: "네, 정말 큰 도움이 돼요. 식물을 돌보는 것만으로도 마음이 편안해져요.",
    username: "김민철",
    createdAt: "2023-06-16T23:00:00",
    updatedAt: "2023-06-16T23:00:00",
    parentId: 1023,
  },
  {
    id: 1025,
    content: "퇴직 후의 시간 관리는 어떻게 하시나요? 지루할 때도 있나요?",
    username: "시간관리",
    createdAt: "2023-06-17T09:30:00",
    updatedAt: "2023-06-17T09:30:00",
    parentId: null,
  },
  {
    id: 1026,
    content: "규칙적인 일과를 만들어 지내고 있어요. 할 일이 많아 지루할 틈이 없답니다!",
    username: "김민철",
    createdAt: "2023-06-17T10:15:00",
    updatedAt: "2023-06-17T10:15:00",
    parentId: 1025,
  },
  {
    id: 1027,
    content: "손주들과 함께 하는 시간... 정말 부럽습니다. 좋은 할아버지 되시네요!",
    username: "가족사랑",
    createdAt: "2023-06-17T11:20:00",
    updatedAt: "2023-06-17T11:20:00",
    parentId: null,
  },
  {
    id: 1028,
    content: "퇴직 전에 미리 준비해야 할 것들이 있다면 어떤 것들이 있을까요?",
    username: "미래대비",
    createdAt: "2023-06-17T12:40:00",
    updatedAt: "2023-06-17T12:40:00",
    parentId: null,
  },
  {
    id: 1029,
    content: "건강 검진, 재정 계획, 그리고 새로운 취미 탐색을 추천드려요. 미리 준비하면 큰 도움이 됩니다.",
    username: "김민철",
    createdAt: "2023-06-17T13:30:00",
    updatedAt: "2023-06-17T13:30:00",
    parentId: 1028,
  },
  {
    id: 1030,
    content: "정원 사진 더 올려주세요! 정말 아름답네요.",
    username: "사진애호가",
    createdAt: "2023-06-17T14:50:00",
    updatedAt: "2023-06-17T14:50:00",
    parentId: null,
  },
];

// =========================================
// 3. useMock 설정
// =========================================
const useMock = false; // false로 바꾸면 Real API로 동작

// =========================================
// 4. Mock API 구현
// =========================================

// ----- 게시글 Mock API -----
async function getMockPostDetail(postId: number): Promise<Post> {
  const found = mockPosts.find((p) => p.id === postId);
  if (!found) throw new Error("Mock: 해당 포스트가 없습니다.");
  return Promise.resolve(found);
}

async function createMockPost(title: string, content: string, category: string, userId: string, files?: File[]): Promise<{ postId: number }> {
  const newPost: Post = {
    id: Date.now(),
    title,
    content,
    category,
    userId,
    userName: "Mock 사용자",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
    likeByMe: false,
    images: [], // 파일 리스트를 실제 URL로 전환하는 과정은 생략
  };
  mockPosts.push(newPost);
  return Promise.resolve({ postId: newPost.id });
}

async function updateMockPost(postId: number, title: string, content: string, category: string, userId: string, deleteImageIds?: number[], newFiles?: File[]): Promise<void> {
  const idx = mockPosts.findIndex((p) => p.id === postId);
  if (idx === -1) throw new Error("Mock: 수정할 포스트를 찾지 못했습니다.");

  // 권한 체크 로직은 생략 (userId 비교)
  mockPosts[idx] = {
    ...mockPosts[idx],
    title,
    content,
    category,
    updatedAt: new Date().toISOString(),
    // 이미지 삭제/추가 로직은 실제로 구현 시 파일 처리 필요
    images: mockPosts[idx].images.filter((img) => !deleteImageIds?.includes(img.imageId)),
  };
  return Promise.resolve();
}

async function deleteMockPost(postId: number, userId: string): Promise<void> {
  const idx = mockPosts.findIndex((p) => p.id === postId);
  if (idx === -1) throw new Error("Mock: 삭제할 포스트를 찾지 못했습니다.");
  // 권한 체크 로직은 생략
  mockPosts.splice(idx, 1);
  return Promise.resolve();
}

async function likeMockPost(postId: number, userId: string): Promise<"Liked" | "Unliked"> {
  // Mock에서는 간단히 likes 증가/감소 토글
  const post = mockPosts.find((p) => p.id === postId);
  if (!post) throw new Error("Mock: 좋아요할 포스트를 찾지 못했습니다.");

  post.likeByMe = !post.likeByMe;
  post.likes = post.likeByMe ? post.likes + 1 : post.likes - 1;
  return Promise.resolve(post.likeByMe ? "Liked" : "Unliked");
}

// ----- 댓글 Mock API -----
async function getMockComments(postId: number): Promise<Comment[]> {
  // 실제로는 postId에 연결된 댓글만 필터링해야 하지만, 여기서는 모두 반환
  return Promise.resolve(mockComments.filter((c) => c.parentId === null));
}

async function getMockChildrenComments(parentId: number): Promise<Comment[]> {
  const children = mockComments.filter((c) => c.parentId === parentId);
  return Promise.resolve(children);
}

async function createMockComment(postId: number, content: string, userId: string, parentId: number | null): Promise<Comment> {
  const newComment: Comment = {
    id: Date.now(),
    content,
    username: "Mock 댓글 작성자",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    parentId: parentId,
  };
  mockComments.push(newComment);
  return Promise.resolve(newComment);
}

async function updateMockComment(commentId: number, content: string, userId: string): Promise<Comment> {
  const idx = mockComments.findIndex((c) => c.id === commentId);
  if (idx === -1) throw new Error("Mock: 수정할 댓글을 찾지 못했습니다.");
  // 권한 체크 로직 생략
  mockComments[idx] = {
    ...mockComments[idx],
    content,
    updatedAt: new Date().toISOString(),
  };
  return Promise.resolve(mockComments[idx]);
}

async function deleteMockComment(commentId: number, userId: string): Promise<void> {
  const idx = mockComments.findIndex((c) => c.id === commentId);
  if (idx === -1) throw new Error("Mock: 삭제할 댓글을 찾지 못했습니다.");
  // 권한 체크 로직 생략
  mockComments.splice(idx, 1);
  return Promise.resolve();
}

// =========================================
// 5. Real API (실제 서버와 통신) 구현
// =========================================

// ----- 게시글 Real API -----
async function getPostDetail(postId: number): Promise<Post> {
  const response = await fetch(`/posts/${postId}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("게시글 상세 조회 실패");
  const data = await response.json();
  console.log(data);
  return data;
}

async function createPost(title: string, content: string, category: string, userId: string, files?: File[]): Promise<{ postId: number }> {
  // multipart/form-data 구성 예시
  const formData = new FormData();
  const postDto = {
    title,
    content,
    category,
    userId,
  };
  formData.append("postDto", new Blob([JSON.stringify(postDto)], { type: "application/json" }));
  if (files) {
    files.forEach((file) => formData.append("images", file));
  }

  const response = await fetch(`/posts`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("게시글 생성 실패");
  return response.json();
}

async function updatePost(postId: number, title: string, content: string, category: string, userId: string, deleteImageIds?: number[], newFiles?: File[]): Promise<void> {
  const formData = new FormData();
  const postDto = {
    title,
    content,
    category,
    userId,
    deleteImageIds,
  };
  console.log("🔍 보낼 데이터:", postDto);
  console.log("🖼 추가할 이미지:", newFiles);
  formData.append("postDto", new Blob([JSON.stringify(postDto)], { type: "application/json" }));

  if (newFiles) {
    newFiles.forEach((file) => {
      formData.append("newImages", file);
      console.log("📸 추가된 이미지 파일:", file.name);
    });
  }

  const response = await fetch(`/posts/${postId}`, {
    method: "PATCH",
    body: formData,
  });

  console.log("🔍 서버 응답 상태 코드:", response.status);

  if (!response.ok) {
    console.error("❌ 게시글 수정 실패");
    throw new Error("게시글 수정 실패");
  }
}

async function deletePost(postId: number, userId: string): Promise<void> {
  const response = await fetch(`/posts/${postId}?userId=${userId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("게시글 삭제 실패");
}

async function likePost(postId: number, userId: string): Promise<"Liked" | "Unliked"> {
  const response = await fetch(`/posts/like/${postId}?userId=${userId}`, {
    method: "PATCH",
  });
  if (!response.ok) throw new Error("게시글 좋아요/취소 실패");
  return response.json(); // "Liked" or "Unliked"
}

// ----- 댓글 Real API -----
async function getCommentsByPostId(postId: number): Promise<Comment[]> {
  const response = await fetch(`/comments/posts/${postId}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("댓글 조회 실패");
  return response.json();
}

async function getChildrenComments(parentId: number): Promise<Comment[]> {
  const response = await fetch(`/comments/children/${parentId}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("자식 댓글 조회 실패");
  return response.json();
}

async function createNewComment(postId: number, content: string, userId: string, parentId: number | null): Promise<Comment> {
  const body = {
    postId,
    content,
    userId,
    parentId,
  };
  const response = await fetch(`/comments/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("댓글 생성 실패");
  return response.json();
}

async function updateExistingComment(commentId: number, content: string, userId: string): Promise<Comment> {
  const response = await fetch(`/comments/posts/${commentId}?userId=${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "text/plain" },
    body: content,
  });
  if (!response.ok) throw new Error("댓글 수정 실패");
  return response.json();
}

async function removeComment(commentId: number, userId: string): Promise<void> {
  const response = await fetch(`/comments/posts/${commentId}?userId=${userId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("댓글 삭제 실패");
}

// =========================================
// 6. 통합 export: Mock/Real 스위칭
// =========================================

export const todayAPI = {
  // 게시글
  getPostDetail: useMock ? getMockPostDetail : getPostDetail,
  createPost: useMock ? createMockPost : createPost,
  updatePost: useMock ? updateMockPost : updatePost,
  deletePost: useMock ? deleteMockPost : deletePost,
  likePost: useMock ? likeMockPost : likePost,

  // 댓글
  getComments: useMock ? getMockComments : getCommentsByPostId,
  getChildrenComments: useMock ? getMockChildrenComments : getChildrenComments,
  createComment: useMock ? createMockComment : createNewComment,
  updateComment: useMock ? updateMockComment : updateExistingComment,
  deleteComment: useMock ? deleteMockComment : removeComment,
};
