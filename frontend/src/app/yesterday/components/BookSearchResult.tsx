"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { searchBook } from "@/lib/api"
import type { Book } from "@/lib/api" // Book 인터페이스 import
import { useRouter, usePathname } from "next/navigation"

interface BookSearchResultProps {
  query: string
}

//   랜덤 이미지 생성 함수
const getRandomImage = () => {
  const imageNumber = Math.floor(Math.random() * 9) + 1
  return `/placeholder/bookcover/thumb (${imageNumber}).webp`
}

export const BookSearchResult: React.FC<BookSearchResultProps> = ({ query }) => {
  const [searchResults, setSearchResults] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const pathname = usePathname()

  const onClickBook = (bookId : number) => {
    router.push(`/yesterday/book/${bookId}`)
  }

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const results = await searchBook(query)
        setSearchResults(results)
      } catch (err) {
        setError("검색 결과를 불러오는 중 오류가 발생했습니다.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (query) {
      fetchSearchResults()
    }
  }, [query])

  if (isLoading) {
    return <div className="text-center">검색 중...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-spring-forest px-4">검색 결과: "{query}"</h2>
      {searchResults.length === 0 ? (
        <div className="text-center">검색 결과가 없습니다.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
          {searchResults.map((book: Book) => (
            <Card key={book.id ?? Math.random()} className="flex overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => onClickBook(book.id)}>
              <div className="w-1/3 relative">
                <Image
                  src={book.coverImage || getRandomImage()}
                  alt={`${book.title ?? "제목 없음"} 표지`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <CardContent className="w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-spring-forest line-clamp-2">
                    {book.title ?? "제목 없음"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    저자: {book.authorNickname ?? "알 수 없음"}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <span className="mr-3">👁️ {book.viewCount ?? 0}</span>
                    <span>❤️ {book.likeCount ?? 0}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {(book.tags && book.tags.length > 0) ? (
                    book.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-spring-olive text-white">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">태그 없음</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
