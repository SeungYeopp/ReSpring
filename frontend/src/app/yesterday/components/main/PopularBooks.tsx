"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { getAllBooksScrolled, type Book } from "@/lib/api"
import { BookCard } from "./BookCard"

const INITIAL_LOAD_SIZE = 10
const LOAD_MORE_SIZE = 5

export default function PopularBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [lastBook, setLastBook] = useState<Book | null>(null)

  const observer = useRef<IntersectionObserver | null>(null)
  const lastBookElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchBooks()
        }
      })
      if (node) observer.current.observe(node)
    },
    [isLoading, hasMore],
  )

  const fetchBooks = useCallback(async () => {
    if (!hasMore) return

    setIsLoading(true)
    try {
      const newBooks = await getAllBooksScrolled(
        lastBook?.likeCount ?? 1987654321,
        lastBook?.viewCount ?? 1987654321,
        lastBook?.id ?? 1987654321,
        lastBook?.createdAt ?? null,
        books.length === 0 ? INITIAL_LOAD_SIZE : LOAD_MORE_SIZE,
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
  }, [lastBook, books.length, hasMore])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  if (error) {
    return <div className="mt-8 px-4 text-red-500">{error}</div>
  }

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book, index) => (
          <div key={book.id} ref={index === books.length - 1 ? lastBookElementRef : null}>
            <BookCard book={book} />
          </div>
        ))}
      </div>
      {isLoading && <div className="text-center mt-4">책 정보를 불러오는 중입니다...</div>}
    </div>
  )
}

