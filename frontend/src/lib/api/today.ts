import axios from "axios";
import { posts } from "../../app/today/mocks/posts";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export interface Post {
  id: number; // 게시물 고유 ID
  title: string; // 게시물 제목
  content: string; // 게시물 내용
  category: string; // 게시물 카테고리 (INFORMATION_SHARING, 고민/질문)
  userId: string; // 작성자 ID
  userName: string; // 작성자 이름
  createdAt: string; // 생성 날짜 및 시간
  updatedAt: string; // 수정 날짜 및 시간
  likes: number; // 좋아요 수
  images: string[]; // 게시물에 첨부된 이미지 URL 배열
}

/**
 * 인기 게시물 목록을 가져오는 함수
 * @returns Post[] - 인기 게시물 배열
 */
export async function getPopularPosts(): Promise<Post[]> {
  try {
    // 서버에서 인기 게시물을 가져옵니다.
    const response = await axios.get<Post[]>(`${API_BASE_URL}/posts/popular`);
    return response.data;
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    // 서버가 꺼져 있거나 오류 발생 시, 목데이터에서 일부 게시물(예: 첫 3개) 반환
    return posts.slice(0, 3);
  }
}

/**
 * 전체 게시물 목록을 가져오는 함수
 * @param lastId - 페이지네이션을 위한 마지막 게시물 ID (옵션)
 * @param limit - 한 번에 가져올 게시물 수 (기본값: 10)
 * @returns Post[] - 전체 게시물 배열
 */
export async function getAllPosts(lastId?: number, limit = 10): Promise<Post[]> {
  try {
    // 서버에서 전체 게시물을 가져옵니다.
    const response = await axios.get<Post[]>(`${API_BASE_URL}/posts/all`, {
      params: { lastId, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all posts:", error);
    // 서버가 꺼져 있거나 오류 발생 시, 목데이터 반환
    return posts.slice(0, limit);
  }
}

// 새로 추가된 타입 정의
export interface CreatePostDto {
  title: string;
  content: string;
  category: string;
  userId: string;
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
export async function createPost(postData: CreatePostDto, images?: File[]): Promise<CreatePostResponse> {
  try {
    const formData = new FormData();

    // postDto를 JSON 문자열로 변환하여 추가
    formData.append("postDto", JSON.stringify(postData));

    // 이미지가 있다면 추가
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await axios.post<CreatePostResponse>(`${API_BASE_URL}/posts`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("게시글 생성에 실패했습니다.");
  }
}

import { posts as mockFollowedPosts } from "@/app/today/mocks/posts"; // ✅ Mock 데이터 활용

/**
 * ✅ 구독한 사람들의 게시물 가져오기 (현재 Mock 데이터 사용)
 * @param lastId - 페이지네이션을 위한 마지막 게시물 ID (옵션)
 * @param limit - 한 번에 가져올 게시물 수 (기본값: 10)
 * @returns Post[] - 구독한 사람들의 게시물 배열
 */
export async function getFollowedPosts(lastId?: number | null | undefined, limit = 10): Promise<Post[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredPosts = lastId ? mockFollowedPosts.filter((post) => post.id < lastId).slice(0, limit) : mockFollowedPosts.slice(0, limit);
      resolve(filteredPosts);
    }, 500); // ✅ 0.5초 지연 후 데이터 반환 (실제 API 응답처럼 보이도록)
  });
}
