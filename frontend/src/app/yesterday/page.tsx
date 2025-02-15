import TopCarousel from "./components/main/TopCarousel"
import { AutocompleteBookSearchBar } from "@/app/yesterday/components/AutocompleteBookSearchBar"
import PopularBooks from "./components/main/PopularBooks"
import TaggedPopularBooks from "./components/main/TaggedPopularBooks"
import { BookSearchResult } from "./components/BookSearchResult"
import BubbleMenuYesterday from "@/components/custom/BubbleMenuYesterday"
import { CarouselHeader } from "@/components/custom/CarouselHeader"
import { carouselMessages } from "@/lib/constants"

export default function YesterdayPage({ searchParams }: { searchParams: { q?: string } }) {
  const searchQuery = searchParams.q || ""
  return (
    <div className="flex flex-col min-h-screen bg-spring-pink md:-my-4">
      <main className="flex-grow pb-16">
        <div className="mx-auto px-4 max-w-none lg:pl-[20px]">
          <div className="lg:flex">
            <div className="lg:w-[800px] lg:flex-shrink-0">
              <div className="-mx-4">
                <CarouselHeader messages={carouselMessages.yesterday} />
              </div>

              <div className="mb-4 mt-4">
                <AutocompleteBookSearchBar defaultValue={searchQuery} placeholder="봄날의 서 제목을 입력하세요..." />
              </div>

              {searchQuery ? (
                <BookSearchResult query={searchQuery} />
              ) : (
                <>
                  <TopCarousel />
                  <PopularBooks />
                </>
              )}
            </div>

            {/* <div className="lg:flex-1 lg:ml-8">
              <TaggedPopularBooks />
            </div> */}
          </div>
        </div>
        <BubbleMenuYesterday />
      </main>
    </div>
  )
}

