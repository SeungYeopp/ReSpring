import axiosAPI from "@/lib/api/axios";
//import { posts, popularPosts, followedPosts } from "@/app/today/mocks/posts";
import { Image } from "./story";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export interface Comment {
  id: number;
  content: string;
  userId?: string;
  userNickname: string;
  profileImg?: string;
  createdAt: string;
  updatedAt: string;
  parentId: number | null;
  postId?: number;
  bookId?: number;
  postTitle?: string;
  bookTitle?: string;
  likeCount?: number;
}

export interface Post {
  id: number; // 게시물 고유 ID
  title: string; // 게시물 제목
  content: string; // 게시물 내용
  category: string; // 게시물 카테고리 (INFORMATION_SHARING, 고민/질문)
  userId?: string; // 작성자 ID
  ownerNickname?: string; // 작성자 이름
  ownerProfileImage?: string;
  createdAt: string; // 생성 날짜 및 시간
  updatedAt: string; // 수정 날짜 및 시간
  likes: number; // 좋아요 수
  images: string[]; // 게시물에 첨부된 이미지 URL 배열
  commentCount: number;
  comments: Comment[];
  liked: boolean;
}

/**
 * 인기 게시물 목록을 가져오는 함수
 * @returns Post[] - 인기 게시물 배열
 */
export async function getPopularPosts(): Promise<Post[]> {
  try {
    // 서버에서 인기 게시물을 가져옵니다.
    const response = await axiosAPI.get<Post[]>(`/posts/popular`);
    return response.data;
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    // 서버가 꺼져 있거나 오류 발생 시, 목데이터에서 일부 게시물(예: 첫 3개) 반환
    // return popularPosts?.slice(0, 3) ?? [];
    return [];
  }
}

/**
 * 전체 게시물 목록을 가져오는 함수
 * @param lastId - 페이지네이션을 위한 마지막 게시물 ID (옵션)
 * @param limit - 한 번에 가져올 게시물 수 (기본값: 10)
 * @returns Post[] - 전체 게시물 배열
 */
export async function getAllPosts(
  lastId?: number,
  limit = 10
): Promise<Post[]> {
  try {
    const response = await axiosAPI.get<Post[]>(
      `/posts?lastId=${lastId}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all posts:", error);
    // 서버가 꺼져 있거나 오류 발생 시, 목데이터 반환
    return [];
  }
}

export async function getPostDetail(postId: number): Promise<Post> {
  try {
    const response = await axiosAPI.get<Post>(`/posts/${postId}`);

    return response.data;
  } catch (error) {
    console.error("상세 게시글 가져오기 실패:", error);
    throw new Error("상세 게시글 가져오기 실패");
  }
}

// 새로 추가된 타입 정의
export interface CreatePostDto {
  title: string;
  content: string;
  category: string;
  userId?: string;
}

export interface CreatePostResponse {
  postId: number;
}

/**
 * 새 게시물을 생성하는 함수
 * @param postData - 생성할 게시물 데이터
 * @param images - 업로드할 이미지 파일 배열 (선택사항)
 * @returns CreatePostResponse - 생성된 게시물의 ID를 포함한 응답
 */
export async function createPost(
  postData: CreatePostDto,
  images?: File[]
): Promise<CreatePostResponse> {
  try {
    const formData = new FormData();
    const title = postData.title;
    const content = postData.content;
    const category = postData.category;

    const postDto = {
      title,
      content,
      category,
    };

    formData.append("postDto", JSON.stringify(postDto));

    // 이미지가 있다면 추가
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await axiosAPI.post<CreatePostResponse>(
      `/posts`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  } catch (error:any) {
    alert(error.response.data.message || "게시물 생성 중 에러가 발생했습니다.");
    return Promise.reject(error.response.data.message);
  }
}

/**
 *   구독한 사람들의 게시물 가져오기 (현재 Mock 데이터 사용)
 * @param lastId - 페이지네이션을 위한 마지막 게시물 ID (옵션)
 * @param limit - 한 번에 가져올 게시물 수 (기본값: 10)
 * @returns Post[] - 구독한 사람들의 게시물 배열
 */
// export async function getFollowedPosts(lastId?: number | null | undefined, limit = 10): Promise<Post[]> {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const filteredPosts = lastId ? followedPosts.filter((post) => post.id < lastId).slice(0, limit) : followedPosts.slice(0, limit);
//       resolve(filteredPosts);
//     }, 500); //   0.5초 지연 후 데이터 반환 (실제 API 응답처럼 보이도록)
//   });
// }

export async function createNewCommunityComment(
  postId: number,
  content: string
): Promise<Comment> {
  try {
    const formData = new FormData();

    const postDto = {
      content,
      postId,
    };

    const response = await axiosAPI.post(
      `/comments/posts`,
      JSON.stringify(postDto),
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("댓글 생성 실패");
  }
}

export async function createNewCommunityChildComment(
  postId: number,
  content: string,
  parentId: number
): Promise<Comment> {
  try {
    const formData = new FormData();

    const postDto = {
      content,
      postId,
      parentId,
    };

    const response = await axiosAPI.post(
      `/comments/posts`,
      JSON.stringify(postDto),
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("댓글 생성 실패");
  }
}

export async function getCommentsByPostId(postId: number): Promise<Comment[]> {
  try {
    const response = await axiosAPI.get<Comment[]>(`/comments/posts/${postId}`);

    return response.data;
  } catch (error) {
    console.error("게시글에 달린 댓글들 가져오기 실패:", error);
    throw new Error("게시글에 달린 댓글들 가져오기 실패");
  }
}

export async function getChildrenComments(
  parentId: number
): Promise<Comment[]> {
  try {
    const response = await axiosAPI.get(`/comments/children/${parentId}`);

    return response.data;
  } catch (error) {
    throw new Error("자식 댓글 조회 실패");
  }
}

export async function updatePost(
  postId: number,
  title: string,
  content: string,
  category: string,
  deleteImageIds?: String[],
  newFiles?: File[]
): Promise<void> {
  try {
    const formData = new FormData();
    const postDto = {
      title,
      content,
      category,
      deleteImageIds,
    };
    formData.append(
      "postDto",
      new Blob([JSON.stringify(postDto)], { type: "application/json" })
    );

    if (newFiles) {
      newFiles.forEach((file) => {
        formData.append("newImages", file);
      });
    }

    const response = await axiosAPI.patch(`/posts/${postId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

  } catch (error) {
    throw new Error("게시글 수정 실패");
  }
}

export async function deletePost(
  postId: number,
  userId: string
): Promise<void> {
  try {
    const response = await axiosAPI.delete(`/posts/${postId}?userId=${userId}`);
  } catch (error) {
    // console.log(error);
    throw new Error("게시글 삭제 실패");
  }
}

export async function likePost(postId: number): Promise<"Liked" | "Unliked"> {
  try {
    const response = await axiosAPI.patch(`/posts/like/${postId}`);
    return response.data; // "Liked" or "Unliked"
  } catch (error) {
    throw new Error("게시글 좋아요/취소 실패");
  }
}

export async function checkIfUserLiked(postId: number): Promise<boolean> {
  try {
    const response = await axiosAPI.get(`/posts/like/${postId}`);

    return response.data;
  } catch (error) {
    throw new Error("게시글 좋아요 확인 실패");
  }
}

/**
 * 특정 사용자의 게시물 목록을 가져오는 함수
 * @param userNickname - 게시물을 가져올 사용자 닉네임
 * @returns Promise<PostDetails[]> - 해당 사용자의 게시물 배열
 */
export async function getPostsByUserId(userNickname: string): Promise<Post[]> {
  try {
    const response = await axios.get<Post[]>(
      `${API_BASE_URL}/posts/users/${userNickname}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching posts for user ${userNickname}:`, error);
    throw new Error("게시물을 불러오는 데 실패했습니다.");
  }
}

/**
 * 특정 사용자의 댓글 목록을 가져오는 함수
 * @param userId - 댓글을 가져올 사용자 ID
 * @returns Promise<CommentDetails[]> - 해당 사용자의 댓글 배열
 */
export async function getCommentsByUserId(userId: string): Promise<Comment[]> {
  try {
    const response = await axios.get<Comment[]>(
      `${API_BASE_URL}/comments/posts`,
      {
        params: { userId }, // userId를 query parameter로 전달
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for user ${userId}:`, error);
    throw new Error("댓글을 불러오는 데 실패했습니다.");
  }
}

export async function likeComment(commentId: number): Promise<boolean> {
  try {
    const response = await axiosAPI.post(`/comments/${commentId}/like`);

    return response.data; // true 면 좋아요, false는 좋아요 취소.
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getMyPostComments(): Promise<Comment[]> {
  try {
    const response = await axiosAPI.get("/comments/posts");

    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function deleteComment(commentId: number): Promise<boolean> {
  try {
    const response = await axiosAPI.delete(`/comments/posts/${commentId}`);

    if (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 204
    )
      return true;
    else return false;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function updateComment(
  commentId: number,
  content: string
): Promise<Comment> {
  try {
    const response = await axiosAPI.patch(`/comments/posts/${commentId}`, {
      content,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getCommentLikes(commentId: number): Promise<number> {
  try {
    const response = await axiosAPI.get(`comments/${commentId}/likes/count`);

    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function checkIfUserLikedComment(
  commentId: number
): Promise<boolean> {
  try {
    const response = await axiosAPI.get(`/comments/${commentId}/likes/check`);

    return response.data; // true면 좋아요 누름, false면 안 누름.
  } catch (error: any) {
    throw new Error(error);
  }
}

// 댓글 좋아요 순 정렬 미구현.
// export async function getPostCommentsSortByLikes(postId : number) : Promise<Comment[]>{
//   try{
//     return []
//   }catch(error : any){
//     throw new Error(error)
//   }
// }

// 내가 작성한 댓글 모두 보여주기. (책 + 게시글 포함)
export async function getCommentsIWrote(): Promise<Comment[]> {
  try {
    const response = await axiosAPI.get("/comments/my-comments");

    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
}

// 내가 작성한 게시글 전체 불러오기.
export async function getMyPost(): Promise<Post[]> {
  try {
    const response = await axiosAPI.get("/posts/my");

    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
}

// 제목으로 포스트 검색.
export async function searchPostsByTitle(title: string): Promise<Post[]> {
  try {
    const response = await axiosAPI.get("/posts/search");

    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function filterPosts(category: string): Promise<Post[]> {
  try {
    const response = await axiosAPI.get(`/posts/filter?category=${category}`);

    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
}
