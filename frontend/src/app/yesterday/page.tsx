"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import TopCarousel from "./components/main/TopCarousel"
import PopularBooks from "./components/main/PopularBooks"
import { BookSearchResult } from "./components/BookSearchResult"
import BubbleMenuYesterday from "@/components/custom/BubbleMenuYesterday"
import { CarouselHeader } from "@/components/custom/CarouselHeader"
import { carouselMessages } from "@/lib/constants"
import { Book, BookOpen, Search, SlidersHorizontal, User, TagIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function YesterdayPage({ searchParams }: { searchParams: { q?: string } }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(searchParams.q || "")
  const [searchType, setSearchType] = useState("title")
  const [sortBy, setSortBy] = useState("newest")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/yesterday/explore?q=${encodeURIComponent(searchQuery)}&type=${searchType}&sort=${sortBy}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-spring-pink overflow-y-auto relative touch-action-pan-y md:-my-4 lg:-my-8 sm:mt-0 sm:my-0">
      <main className="flex-grow flex flex-col space-y-4 bg-background">
        <div className="lg:mt-4 w-full mb-6">
          <CarouselHeader messages={carouselMessages.yesterday} />
        </div>

        <div className="mb-6 mt-4 mx-4 font-laundrygothicbold">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-r-none  text-[#665048] border-[#638d3e]">
                    {searchType === "title" && <Book className="mr-2 h-4 w-4" />}
                    {searchType === "author" && <User className="mr-2 h-4 w-4" />}
                    {searchType === "tag" && <TagIcon className="mr-2 h-4 w-4" />}
                    {searchType === "title" ? "제목" : searchType === "author" ? "작성자" : "태그"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56  border-[#638d3e]">
                  <DropdownMenuRadioGroup value={searchType} onValueChange={setSearchType}>
                    <DropdownMenuRadioItem value="title" className="text-[#665048]">
                      제목
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="author" className="text-[#665048]">
                      작성자
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="tag" className="text-[#665048]">
                      태그
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Input
              type="text"
              placeholder={`${searchType === "title" ? "제목" : searchType === "author" ? "작성자" : "태그"}으로 검색...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-10 rounded-l-none border-[#638d3e] bg-white text-[#665048]"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#638d3e] cursor-pointer" onClick={handleSearch} />
          </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="text-[#638d3e]" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]  text-[#665048] border-[#638d3e]">
                  <SelectValue placeholder="정렬 기준" />
                </SelectTrigger>
                <SelectContent className=" border-[#638d3e]">
                  <SelectItem value="newest" className="text-[#665048]">
                    최신순
                  </SelectItem>
                  <SelectItem value="popular" className="text-[#665048]">
                    인기순
                  </SelectItem>
                  <SelectItem value="views" className="text-[#665048]">
                    조회수순
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>

        {searchParams.q ? (
          <BookSearchResult query={searchParams.q} />
        ) : (
          <>
            <section className="mb-8 transition-all duration-300 hover:bg-accent/5 rounded-lg p-4">
              <TopCarousel />
            </section>

            <section className="mb-8 transition-all duration-300 hover:bg-accent/5 rounded-lg p-4 pb-20">
              <h2 className="text-lg sm:text-xl md:text-2xl font-laundrygothicbold font-semibold mb-4 text-primary flex items-center">
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

