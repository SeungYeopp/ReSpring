import PopularPosts from "./components/popular-posts";
// import FollowedPosts from "./components/followed-posts";
import CommunityPosts from "./components/community-posts";
import { getPopularPosts, type Post } from "@/lib/api";
import { posts as mockFollowedPosts } from "./mocks/posts"; // 임시로 목데이터 사용

export default async function TodayPage() {
  const popularPosts = await getPopularPosts();

  return (
    <div className="h-full flex flex-col space-y-1 overflow-y-auto bg-gray-50">
      <section className="p-2 sm:p-4 bg-gray-100">
        <h2 className="text-lg font-semibold mb-2 text-primary">인기글</h2>
        <PopularPosts posts={popularPosts} />
      </section>

      <section className="p-2 sm:p-4 bg-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold mb-2 text-primary">내가 구독한 사람의 글</h2>
        {/* <FollowedPosts posts={mockFollowedPosts.slice(0, 1)} /> */}
      </section>

      <section className="p-2 sm:p-4 bg-gray-100 flex-grow">
        <h2 className="text-lg font-semibold mb-2 text-primary">생각 나누기</h2>
        <CommunityPosts />
      </section>
    </div>
  );
}
