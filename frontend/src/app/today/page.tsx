import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PopularPosts from "./components/popular-posts";
import CommunityPosts from "./components/community-posts";
import FollowedPosts from "./components/followed-posts"; // ✅ 추가
import { getPopularPosts } from "@/lib/api";
import { posts as mockFollowedPosts } from "./mocks/posts";
import BubbleMenuToday from "@/components/custom/BubbleMenuToday";
import { Button } from "@/components/ui/button";

export default async function TodayPage() {
  const popularPosts = await getPopularPosts();

  return (
    <div className="h-full flex flex-col space-y-4 overflow-y-auto relative">
      {/* 🔹 인기글 섹션 */}
      <section className="px-4 py-2 sm:px-6 sm:py-4">
        <h2 className="text-lg font-semibold mb-2 text-primary">인기글</h2>
        <PopularPosts/>
      </section>

      {/* 🔹 내가 구독한 사람의 글 */}
      <section className="px-4 py-2 sm:px-6 sm:py-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-primary">내가 구독한 사람의 글</h2>
          {mockFollowedPosts.length > 0 && (
            <Button variant="outline" size="sm" className="text-primary hover:text-primary-foreground hover:bg-primary transition-colors duration-200" asChild>
              <Link href="/today/following" className="flex items-center">
                더보기
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
        {mockFollowedPosts.length > 0 ? (
          <FollowedPosts posts={mockFollowedPosts.slice(0, 1)} /> // ✅ 3개만 표시 후 "더보기" 버튼으로 이동
        ) : (
          <p className="text-muted-foreground text-sm">아직 구독한 사람이 없습니다.</p>
        )}
      </section>

      {/* 🔹 생각 나누기 (커뮤니티) */}
      <section className="px-4 py-2 sm:px-6 sm:py-4 flex-grow">
        <h2 className="text-lg font-semibold mb-2 text-primary">생각 나누기</h2>
        <CommunityPosts />
      </section>

      {/* 🔹 우측 하단 플로팅 버튼 (버블 메뉴) */}
      <BubbleMenuToday />
    </div>
  );
}
