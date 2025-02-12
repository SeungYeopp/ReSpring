"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"
import Link from "next/link"
import { getAllBooksByUserId, getLikedBooks, BookInfo } from "@/lib/api/book" // API 함수 가져오기

export default function Recommendations({ bookId }: { bookId: string }) {
  const [authorBooks, setAuthorBooks] = useState<BookInfo[]>([])
  const [followedBooks, setFollowedBooks] = useState<BookInfo[]>([])

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const userId = localStorage.getItem("userId") || ""
        const currentBook = await getAllBooksByUserId(userId)
        const currentBookDetails = currentBook.find(book => book.id === Number(bookId))

        if (currentBookDetails) {
          const authorId = currentBookDetails.authorId

          // 저자의 다른 자서전 가져오기
          const authorBooksData = await getAllBooksByUserId(authorId)
          setAuthorBooks(authorBooksData.filter(book => book.id !== Number(bookId)))

          // 구독 중인 작가의 자서전 가져오기
          const followedBooksData = await getLikedBooks(userId)
          setFollowedBooks(followedBooksData)
        }
      } catch (error) {
        console.error("추천 데이터를 불러오는 중 오류 발생:", error)
      }
    }

    fetchRecommendations()
  }, [bookId])

  return (
    <div className="space-y-8">
      {/* 저자의 다른 이야기 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold px-4">저자의 다른 이야기</h3>
        <div className="overflow-x-auto">
          <div className="flex px-4 pb-4">
            {authorBooks.map((book) => (
              <Card
                key={book.id}
                className="border-0 bg-transparent flex-shrink-0"
                style={{
                  width: "calc((100vw - 32px) / 3)",
                  maxWidth: "200px",
                  minWidth: "120px",
                  marginRight: "12px",
                }}
              >
                <CardContent className="p-0 space-y-2">
                  <AspectRatio ratio={156 / 234}>
                    <Link href={`/books/${book.id}`}>
                      <Image
                        src={book.coverImage || "/placeholder.svg"}
                        alt={book.title}
                        fill
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </Link>
                  </AspectRatio>
                  <div className="space-y-1 px-1">
                    <h4 className="font-medium text-sm leading-tight line-clamp-2">{book.title}</h4>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* 구독 중인 작가의 자서전 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold px-4">구독 중인 작가의 자서전</h3>
        <div className="overflow-x-auto">
          <div className="flex px-4 pb-4">
            {followedBooks.map((book) => (
              <Card
                key={book.id}
                className="border-0 bg-transparent flex-shrink-0"
                style={{
                  width: "calc((100vw - 32px) / 3)",
                  maxWidth: "200px",
                  minWidth: "120px",
                  marginRight: "12px",
                }}
              >
                <CardContent className="p-0 space-y-2">
                  <AspectRatio ratio={156 / 234}>
                    <Link href={`/books/${book.id}`}>
                      <Image
                        src={book.coverImage || "/placeholder.svg"}
                        alt={book.title}
                        fill
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </Link>
                  </AspectRatio>
                  <div className="space-y-1 px-1">
                    <h4 className="font-medium text-sm leading-tight line-clamp-2">{book.title}</h4>
                    <p className="text-xs text-muted-foreground">작성자 ID: {book.authorId}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
