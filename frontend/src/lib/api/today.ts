import axios from "axios";
import { posts } from "../../app/today/mocks/posts"

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
