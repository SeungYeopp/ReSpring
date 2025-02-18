import TopCarousel from "./components/main/TopCarousel"
import { AutocompleteBookSearchBar } from "@/app/yesterday/components/AutocompleteBookSearchBar"
import PopularBooks from "./components/main/PopularBooks"
import TaggedPopularBooks from "./components/main/TaggedPopularBooks"
import { BookSearchResult } from "./components/BookSearchResult"
import BubbleMenuYesterday from "@/components/custom/BubbleMenuYesterday"
import { CarouselHeader } from "@/components/custom/CarouselHeader"
import { carouselMessages } from "@/lib/constants"
import { Book, BookOpen, Tag } from "lucide-react"

export default function YesterdayPage({ searchParams }: { searchParams: { q?: string } }) {
  const searchQuery = searchParams.q || ""
  return (
    <div className="flex flex-col min-h-screen bg-spring-pink -mb-16 md:-my-4 overflow-y-auto relative">
      <main className="-mb-16 md:-my-4 h-full flex flex-col space-y-4 overflow-y-auto relative bg-background">
        <div className="lg:mt-4 w-full mb-6">
          <CarouselHeader messages={carouselMessages.yesterday} />
        </div>

        <div className="mb-6 mt-4 m-4">
          <AutocompleteBookSearchBar defaultValue={searchQuery} placeholder="봄날의 서 제목을 입력하세요..." />
        </div>

        {searchQuery ? (
          <BookSearchResult query={searchQuery} />
        ) : (
          <>
            <section className="mb-8 transition-all duration-300 hover:bg-accent/5 rounded-lg p-4">
              <TopCarousel />
            </section>

            <section className="mb-8 transition-all duration-300 hover:bg-accent/5 rounded-lg p-4 pb-20">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-primary flex items-center">
                <BookOpen className="mr-2 h-6 w-6 text-spring-olive" />
                인기 봄날의 서
              </h2>
              <PopularBooks />
            </section>
          </>
        )}
      </main>
      <BubbleMenuYesterday />
    </div>
  )
}

