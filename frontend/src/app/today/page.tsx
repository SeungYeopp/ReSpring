import { popularPosts, posts } from "./mocks/posts"
import PopularPosts from "./components/popular-posts"
import FollowedPosts from "./components/followed-posts"
import CommunityPosts from "./components/community-posts"

export default function TodayPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      {/* 인기글 섹션 */}
      <section className="px-4 py-6">
        <h2 className="text-xl font-bold mb-4">인기글</h2>
        <PopularPosts posts={popularPosts} />
      </section>

      {/* 팔로우한 사람의 글 섹션 */}
      <section className="px-4 py-6 border-t">
        <h2 className="text-xl font-bold mb-4">팔로우한 사람의 글</h2>
        <FollowedPosts posts={posts.slice(0, 3)} />
      </section>

      {/* 생각 나누기 섹션 */}
      <section className="flex-1 border-t">
        <h2 className="text-xl font-bold px-4 py-6">생각 나누기</h2>
        <CommunityPosts posts={posts} />
      </section>
    </main>
  )
}

