"use client"

import { useState, useEffect } from "react"
import { Book, Search, SlidersHorizontal, User, TagIcon } from "lucide-react"
import { getAllBooks } from "@/lib/api"
import type { Book as BookType } from "../../../lib/api/book"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "./components/pagination"
import BookCard from "./components/BookCard"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import LoadingScreen from "@/components/custom/LoadingScreen"
import { useSearchParams } from "next/navigation";


export default function ExplorePage() {

    // URL에서 전달된 쿼리 파라미터를 가져옵니다.
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";
    const initialType = searchParams.get("type") || "title";
    const initialSort = searchParams.get("sort") || "newest";

    const [books, setBooks] = useState<BookType[]>([])
    const [filteredBooks, setFilteredBooks] = useState<BookType[]>([])
    const [searchQuery, setSearchQuery] = useState(initialQuery)
    const [searchType, setSearchType] = useState(initialType)
    const [sortBy, setSortBy] = useState(initialSort)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(12)
    const [isLoading, setIsLoading] = useState(true)
  
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 640) {
          setItemsPerPage(8)
        } else if (window.innerWidth < 1024) {
          setItemsPerPage(12)
        } else {
          setItemsPerPage(16)
        }
      }
  
      handleResize()
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }, [])
  
    useEffect(() => {
      const fetchBooks = async () => {
        setIsLoading(true)
        try {
          const allBooks = await getAllBooks()
          setBooks(allBooks)
          setFilteredBooks(allBooks)
        } catch (error) {
          console.error("Error fetching books:", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchBooks()
    }, [])
  
    useEffect(() => {
      const filtered = books.filter((book) => {
        const query = searchQuery.toLowerCase()
        switch (searchType) {
          case "title":
            return book.title.toLowerCase().includes(query)
          case "author":
            return book.authorNickname.toLowerCase().includes(query)
          case "tag":
            return book.tags.some((tag) => tag.toLowerCase().includes(query))
          default:
            return true
        }
      })
      const sorted = filtered.sort((a, b) => {
        if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        if (sortBy === "popular") return b.likeCount - a.likeCount
        if (sortBy === "views") return b.viewCount - a.viewCount
        return 0
      })
      setFilteredBooks(sorted)
      setCurrentPage(1)
    }, [searchQuery, searchType, sortBy, books])
  
    const pageCount = Math.ceil(filteredBooks.length / itemsPerPage)
    const paginatedBooks = filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  
    if (isLoading) {
      return <LoadingScreen />
    }
  
    return (
      <div className="container mx-auto px-4 py-8 ">
        <h2 className="text-3xl font-laundrygothicbold mb-8 flex items-center text-black">
          <Search className="mr-2 text-black" />
          봄날의 서 검색
        </h2>
  
        <div className="flex flex-col md:flex-row gap-4 mb-8">
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
              className="pl-4 rounded-l-none border-[#638d3e] bg-white text-[#665048]"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#638d3e]" />
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
        </div>
  
        <div className="mb-4 text-[#638d3e] font-semibold">총 {filteredBooks.length}개의 검색결과</div>
  
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 mb-8">
            {paginatedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[#665048]">
            <p className="text-2xl font-semibold mb-2">검색 결과가 없습니다</p>
            <p>다른 검색어를 시도해보세요</p>
          </div>
        )}
  
        {pageCount > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={pageCount}
            onPageChange={setCurrentPage}
            className="text-[#665048]"
          />
        )}
      </div>
    )
  }
  