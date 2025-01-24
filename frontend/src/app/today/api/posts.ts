import type { Post } from "../types/posts"
import { posts as allPosts } from "../mocks/posts"

const POSTS_PER_PAGE = 5

export async function getPosts(page: number): Promise<Post[]> {
  // 실제 API 호출을 시뮬레이션하기 위해 지연 추가
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const start = (page - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE

  return allPosts.slice(start, end)
}

