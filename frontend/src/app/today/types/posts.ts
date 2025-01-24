// 게시글 카테고리 타입
export type PostCategory = "전체" | "고민/질문" | "정보공유"

// 게시글 작성자 타입
export type Author = {
  id: string
  name: string
  profileImage: string
  generation?: string // 예: "제2인생 뉴비"
}

// 게시글 타입
export type Post = {
  id: string
  author: Author
  title: string
  content: string
  category: PostCategory
  createdAt: string
  likes: number
  comments: number
  isPopular?: boolean // 인기글 여부
}

