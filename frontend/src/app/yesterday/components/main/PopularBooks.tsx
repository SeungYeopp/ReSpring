"use client"

import { useState, useEffect, useCallback } from "react"
import { getAllBooksScrolled, type Book } from "@/lib/api"
import { BookCard } from "./BookCard"

const INITIAL_LOAD_SIZE = 3
const LOAD_MORE_SIZE = 10

export default function PopularBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [lastBook, setLastBook] = useState<Book | null>(null)

  const fetchBooks = useCallback(async () => {
    if (!hasMore) return
    setIsLoading(true)

    try {
      const newBooks = await getAllBooksScrolled(
        lastBook?.likeCount ?? 1987654321,
        lastBook?.viewCount ?? 1987654321,
        lastBook?.id ?? 1987654321,
        lastBook?.createdAt ?? null,
        LOAD_MORE_SIZE,
      )

      if (newBooks.length === 0 || newBooks.length < LOAD_MORE_SIZE) {
        setHasMore(false)
      }

      if (newBooks.length > 0) {
        setBooks((prevBooks) => {
          const uniqueNewBooks = newBooks.filter(
            (newBook) => !prevBooks.some((existingBook) => existingBook.id === newBook.id),
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
  }, [lastBook, hasMore])

  useEffect(() => {
    fetchBooks()
  }, [])

  if (error) {
    return <div className="mt-8 px-4 text-red-500">{error}</div>
  }

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      {hasMore && (
        <div className="text-center mt-4">
          <button
            onClick={fetchBooks}
            className="px-4 py-2 bg-white border-2 border-brand text-brand-dark font-laundrygothicregular rounded-full hover:bg-brand-light/50"
            disabled={isLoading}
          >
            {isLoading ? "불러오는 중..." : "더 보기"}
          </button>
        </div>
      )}
    </div>
  )
}
