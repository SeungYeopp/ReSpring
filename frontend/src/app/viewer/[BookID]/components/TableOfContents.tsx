"use client"

import { useState, useMemo } from "react"
import { useViewerSettings } from "../context/ViewerSettingsContext"
import { usePageContext } from "../context/PageContext"
import { useBookData } from "../hooks/useBookData"
import { useDynamicPages } from "../hooks/useDynamicPages"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react"

interface Chapter {
  title: string
  page: number
}

interface ContentMatch {
  text: string
  page: number
}

const ITEMS_PER_PAGE = 10

export function TableOfContents({ bookId }: { bookId: string }) {
  const { theme } = useViewerSettings()
  const { currentPage, totalPages, setCurrentPage } = usePageContext()
  const { bookContent } = useBookData(bookId)
  //const { pages } = useDynamicPages(bookContent) // 임시로 주석 쳐둠.
  const pages : string[] = []
  const [isOpen, setIsOpen] = useState(false)
  const [searchType, setSearchType] = useState("chapter")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentListPage, setCurrentListPage] = useState(1)

  const chapters: Chapter[] = [
    { title: "서문", page: 0 },
    { title: "1장 - 시작", page: 3 },
    { title: "2장 - 성장", page: 5 },
    { title: "3장 - 전환점", page: 7 },
    { title: "4장 - 새로운 길", page: 9 },
  ]

  const filteredChapters = useMemo(
    () => chapters.filter((chap) => chap.title.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm],
  )

  const contentMatches = useMemo(
    () =>
      pages
        .map((pageText, idx) => ({ text: pageText, page: idx }))
        .filter(({ text }) => text.toLowerCase().includes(searchTerm.toLowerCase())),
    [pages, searchTerm],
  )

  const togglePanel = () => {
    setIsOpen((prev) => !prev)
  }

  // 수정된 goToPage 함수 - 현재 페이지와의 차이를 계산하여 setCurrentPage에 전달
  const goToPage = (targetPage: number) => {
    const difference = targetPage - currentPage
    setCurrentPage(difference)
    setIsOpen(false)
  }

  const totalItems = searchType === "chapter" ? filteredChapters.length : contentMatches.length
  const totalListPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const startIndex = (currentListPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE

  const paginatedItems =
    searchType === "chapter" ? filteredChapters.slice(startIndex, endIndex) : contentMatches.slice(startIndex, endIndex)

  const handleListPageChange = (newPage: number) => {
    setCurrentListPage(newPage)
  }

  const highlightSearchTerm = (text: string) => {
    if (!searchTerm) return text
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"))
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 text-black px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  const getContentPreview = (text: string, maxLength = 100) => {
    const lowerSearchTerm = searchTerm.toLowerCase()
    const index = text.toLowerCase().indexOf(lowerSearchTerm)
    if (index === -1) return text.slice(0, maxLength)

    const start = Math.max(0, index - 20)
    const end = Math.min(text.length, index + searchTerm.length + 20)
    let preview = text.slice(start, end)

    if (start > 0) preview = "..." + preview
    if (end < text.length) preview = preview + "..."

    return preview
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={togglePanel}>
        <BookOpen className="h-5 w-5" />
      </Button>

      {isOpen && <div className="fixed inset-0 bg-black/40 transition-opacity" onClick={togglePanel} />}

      <div
        className={`fixed top-0 right-0 h-full w-[70%] p-4 transition-transform duration-300 ease-in-out border-2 rounded-l-lg overflow-y-auto
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          ${
            theme === "basic"
              ? "bg-white text-black border-gray-400"
              : theme === "gray"
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-black text-white border-gray-800"
          }`}
      >
        <h2 className="text-xl font-bold mb-4">📖 목차 및 검색</h2>

        <Select
          value={searchType}
          onValueChange={(value) => {
            setSearchType(value)
            setCurrentListPage(1)
          }}
        >
          <SelectTrigger className="w-full mb-2">
            <SelectValue placeholder="검색 유형 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chapter">📑 챕터 검색</SelectItem>
            <SelectItem value="content">📜 내용 검색</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="text"
          placeholder={searchType === "chapter" ? "🔍 챕터 제목 검색..." : "🔍 책 내용 검색..."}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentListPage(1)
          }}
          className="w-full p-2 mb-4 border rounded"
        />

        <ul className="space-y-2 mb-4">
          {paginatedItems.map((item, idx) => (
            <li
              key={idx}
              className="cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => goToPage(item.page)}
            >
              {searchType === "chapter" ? (
                highlightSearchTerm((item as Chapter).title)
              ) : (
                <>
                  <strong>📌 {(item as ContentMatch).page + 1}페이지:</strong>{" "}
                  {highlightSearchTerm(getContentPreview((item as ContentMatch).text))}
                </>
              )}
            </li>
          ))}
        </ul>

        {totalListPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleListPageChange(currentListPage - 1)}
              disabled={currentListPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              {currentListPage} / {totalListPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleListPageChange(currentListPage + 1)}
              disabled={currentListPage === totalListPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="mt-4 text-center">
          <span className="font-semibold">
            현재 페이지: {currentPage + 1} / {totalPages}
          </span>
        </div>
      </div>
    </>
  )
}

