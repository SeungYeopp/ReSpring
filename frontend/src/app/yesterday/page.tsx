import TopCarousel from "./components/main/TopCarousel";
import { BookSearchBar } from "./components/main/BookSearchBar";
import PopularBooks from "./components/main/PopularBooks";
import TaggedPopularBooks from "./components/main/TaggedPopularBooks";
import { BookSearchResult } from "./components/BookSearchResult";
import BubbleMenuYesterday from "@/components/custom/BubbleMenuYesterday"
import { CarouselHeader } from "@/components/custom/CarouselHeader";
import { carouselMessages } from "@/lib/constants";

// 서버 컴포넌트에서 searchParams 받기
export default function YesterdayPage({ searchParams }: { searchParams: { q?: string } }) {
  const searchQuery = searchParams.q || ""; // 검색어가 없으면 빈 문자열
  return (
    <div className="flex flex-col min-h-screen bg-spring-pink md:-my-4">
      <main className="flex-grow  pb-16">
        <div className="mx-auto px-4 max-w-none lg:pl-[20px]">
          <div className="lg:flex">
            <div className="lg:w-[800px] lg:flex-shrink-0">
              
              {/* 캐러셀 헤더 추가 */}
              <div className="-mx-4">
                <CarouselHeader messages={carouselMessages.yesterday} />
              </div>
              
              <div className="mb-4 mt-4">
                {/* 서버에서 받은 쿼리로 기본값 전달 */}
                <BookSearchBar defaultValue={searchQuery} placeholder="책 제목 또는 태그를 입력하세요..." />
              </div>

              {/* 검색어가 있으면 결과 보여주기 */}
              {searchQuery ? (
                <BookSearchResult query={searchQuery} />
              ) : (
                <>
                  <TopCarousel />
                  <PopularBooks />
                </>
              )}
            </div>

            {/* 검색어 없을 때만 태그별 인기 서적 표시 */}
            {/* {!searchQuery && (
              <div className="lg:flex-1 lg:ml-8">
                <TaggedPopularBooks />
              </div>
            )} */}
            <div className="lg:flex-1 lg:ml-8">
              <TaggedPopularBooks />
            </div>
          </div>
        </div>
        <BubbleMenuYesterday/>
      </main>
    </div>
  );
}
