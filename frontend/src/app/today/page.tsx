import Link from "next/link"
import { ArrowRight, Flame, Users, MessageSquare } from "lucide-react"
import PopularPosts from "./components/popular-posts"
import CommunityPosts from "./components/community-posts"
import FollowedPosts from "./components/followed-posts"
import { getPopularPosts } from "@/lib/api"
import BubbleMenuToday from "@/components/custom/BubbleMenuToday"
import { Button } from "@/components/ui/button"
import { CarouselHeader } from "@/components/custom/CarouselHeader"
import { carouselMessages } from "@/lib/constants"

export default async function TodayPage() {
  const popularPosts = await getPopularPosts()

  return (
    <div className=" -mb-16 md:-my-4 h-full flex flex-col space-y-4 overflow-y-auto relative bg-background">
      {/* 캐러셀 헤더 */}
      <div className="w-full ">
        <CarouselHeader messages={carouselMessages.today} />
      </div>

      {/* 인기글 섹션 */}
      <section className="px-4 pb-4 sm:px-6 sm:py-2 md:px-8 md:py-8 transition-all duration-300 hover:bg-accent/5">
        <h2 className="font-laundrygothicbold text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-primary flex items-center">
          <Flame className="mr-2 h-6 w-6 text-orange-600" /> {/* 인기글을 나타내는 불꽃 아이콘 */}
          인기글
        </h2>
        <PopularPosts />
      </section>

      {/* 구분선 */}
      <div className="h-px bg-border mx-4 sm:mx-6 md:mx-8" />

      {/* 내가 구독한 사람의 글 */}
      <section className="px-4 pb-4 sm:px-6 sm:py-6 md:px-8 md:py-8 transition-all duration-300 hover:bg-accent/5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary font-laundrygothicbold flex items-center">
            <Users className="mr-2 h-6 w-6 text-[#96b23c]" /> {/* 사람들을 나타내는 아이콘 */}
            소중한 사람들의 이야기
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="text-primary hover:text-primary-foreground hover:bg-primary transition-colors duration-200"
            asChild
          >
            <Link href="/today/following" className="flex items-center">
              <p className="font-laundrygothicregular">더보기</p>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <FollowedPosts />
      </section>

      {/* 구분선 */}
      <div className="h-px bg-border mx-4 sm:mx-6 md:mx-8" />

      {/* 생각 나누기 (커뮤니티) */}
      <section className="px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 flex-grow transition-all duration-300 hover:bg-accent/5">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-primary font-laundrygothicbold flex items-center">
          <MessageSquare className="mr-2 h-6 w-6 text-sky-500" /> {/* 대화를 나타내는 아이콘 */}
          생각 나누기
        </h2>
        <CommunityPosts />
      </section>

      {/* 우측 하단 플로팅 버튼 (버블 메뉴) */}
      <BubbleMenuToday />
    </div>
  )
}

