// 게시글 카테고리 타입
export type PostCategory = "전체" | "고민/질문" | "정보공유";

// 게시글 작성자 타입
export type Author = {
  id: string;
  name: string;
  profileImage: string;
  generation?: string; // 예: "제2인생 뉴비"
};

// 게시글 타입
export type Post = {
  id: number; // 게시글 ID (숫자)
  title: string; // 제목
  content: string; // 본문
  category: PostCategory; // 카테고리
  userId: string; // 작성자 ID
  userName: string; // 작성자 이름
  createdAt: string; // 생성일(문자열)
  updatedAt: string; // 수정일(문자열)
  likes: number; // 좋아요 수
  images: string[]; // 게시글 이미지 배열
};
