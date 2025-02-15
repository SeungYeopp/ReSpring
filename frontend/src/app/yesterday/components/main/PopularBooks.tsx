"use client"

import { useState, useEffect, useCallback } from "react"
import { MainBookCarousel } from "./MainBookCarousel"
import { getAllBooksScrolled, type Book } from "@/lib/api"
import { Button } from "@/components/ui/button"

const INITIAL_LOAD_SIZE = 5
const LOAD_MORE_SIZE = 10

export default function PopularBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [lastBook, setLastBook] = useState<Book | null>(null)

  const fetchBooks = useCallback(
    async (isInitial = false) => {
      if (!hasMore && !isInitial) return

      setIsLoading(true)
      try {
        const newBooks = await getAllBooksScrolled(
          lastBook?.likeCount ?? 1987654321,
          lastBook?.viewCount ?? 1987654321,
          lastBook?.id ?? 1987654321,
          lastBook?.createdAt ?? null,
          isInitial ? INITIAL_LOAD_SIZE : LOAD_MORE_SIZE,
        )

        if (newBooks.length === 0 || newBooks.length < (isInitial ? INITIAL_LOAD_SIZE : LOAD_MORE_SIZE)) {
          setHasMore(false)
        }
        
        if (newBooks.length > 0) {
          setBooks((prevBooks) => {
            const uniqueNewBooks = newBooks.filter(
              (newBook) => !prevBooks.some((existingBook) => existingBook.id === newBook.id)
            )
            return [...prevBooks, ...uniqueNewBooks]
          })
          setLastBook(newBooks[newBooks.length - 1])
        }
      } catch (err) {
        setError("책 정보를 불러오는 데 실패했습니다.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    },
    [lastBook, hasMore],
  )

  useEffect(() => {
    fetchBooks(true)
  }, []) // Remove fetchBooks from the dependency array

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchBooks()
    }
  }

  if (error) {
    return <div className="mt-8 px-4">{error}</div>
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-spring-forest">봄날의 서들</h2>
      {books.length > 0 && <MainBookCarousel title="봄날의 서들" books={books} />}
      {isLoading && <div className="text-center mt-4">책 정보를 불러오는 중입니다...</div>}
      {!isLoading && hasMore && (
        <div className="text-center mt-4">
          <Button onClick={loadMore} className="bg-spring-olive text-white hover:bg-spring-olive/80">
            더 보기
          </Button>
        </div>
      )}
    </div>
  )
}