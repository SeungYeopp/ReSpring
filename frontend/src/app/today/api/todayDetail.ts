/**
 * 오늘(커뮤니티) 섹션 관련 API (게시글 + 댓글)
 * Mock과 Real 함수를 한 파일에서 관리하며,
 * useMock 값에 따라 동작을 전환합니다.
 */

// =========================================
// 1. 게시글 & 댓글에 사용할 타입 정의 (예시)
// =========================================
type Image = {
  imageId: number;
  imageUrl: string;
};

type Post = {
  id: number;
  title: string;
  content: string;
  category: string; // 예: INFORMATION_SHARING
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  images: Image[];
};

type Comment = {
  id: number;
  content: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  parentId: number | null;
};

// =========================================
// 2. 목업 데이터 정의 (예시)
// =========================================
let mockPosts: Post[] = [
  {
    id: 1,
    title: "포스트 제목",
    content: "포스트 내용 (Mock)",
    category: "INFORMATION_SHARING",
    userId: "dd5a7b3c-d887-11ef-b310-d4f32d147183",
    userName: "Mock 유저",
    createdAt: "2023-01-23T10:00:00",
    updatedAt: "2023-01-23T10:00:00",
    likes: 5,
    images: [
      {
        imageId: 101,
        imageUrl: "http://example.com/image1.jpg",
      },
    ],
  },
];

// 댓글은 별도 배열로 관리하거나, 필요하다면 `mockPosts` 각각에 comments를 넣을 수도 있습니다.
let mockComments: Comment[] = [
  {
    id: 1001,
    content: "첫 번째 댓글 (Mock)",
    username: "사용자1",
    createdAt: "2023-01-23T11:00:00",
    updatedAt: "2023-01-23T11:00:00",
    parentId: null,
  },
  {
    id: 1002,
    content: "두 번째 댓글 (Mock)",
    username: "사용자2",
    createdAt: "2023-01-23T11:05:00",
    updatedAt: "2023-01-23T11:05:00",
    parentId: null,
  },
  {
    id: 2001,
    content: "첫 번째 대댓글 (Mock)",
    username: "사용자3",
    createdAt: "2023-01-23T11:10:00",
    updatedAt: "2023-01-23T11:10:00",
    parentId: 1001, // 1001 댓글의 자식
  },
];

// =========================================
// 3. useMock 설정
// =========================================
const useMock = true; // false로 바꾸면 Real API로 동작

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

  // 좋아요를 중복으로 누른 상태 관리가 없으니, 단순 토글
  const liked = post.likes === 5 ? false : true;
  post.likes = liked ? post.likes + 1 : post.likes - 1;
  return Promise.resolve(liked ? "Liked" : "Unliked");
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
  formData.append("postDto", new Blob([JSON.stringify(postDto)], { type: "application/json" }));

  if (newFiles) {
    newFiles.forEach((file) => formData.append("newImages", file));
  }

  const response = await fetch(`/posts/${postId}`, {
    method: "PATCH",
    body: formData,
  });
  if (!response.ok) throw new Error("게시글 수정 실패");
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
