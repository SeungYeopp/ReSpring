"use client"

import { useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useResizeObserver } from "@/hooks/useResizeObserver"
import type { Book } from "@/lib/api"

export interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const router = useRouter()
  const titleRef = useRef<HTMLDivElement>(null)
  const { ref, size } = useResizeObserver()

  const handleClick = () => {
    router.push(`/yesterday/newbook/${book.id}`)
  }

  const placeholderImage = `/placeholder/bookcover/thumb (${Math.floor(Math.random() * 7) + 1}).webp`

  // 카드 크기에 따라 폰트 크기 계산
  const fontSize = Math.max(12, size.width * 0.08) // 최소 12px, 카드 크기에 비례

  useEffect(() => {
    const titleElement = titleRef.current
    if (titleElement) {
      const isOverflowing = titleElement.scrollWidth > titleElement.clientWidth
      if (isOverflowing) {
        titleElement.style.animation = `slide ${titleElement.scrollWidth / 50}s linear infinite`
      } else {
        titleElement.style.animation = "none"
      }
    }
  }, [titleRef])

  return (
    <div
      ref={titleRef}
      className="relative cursor-pointer border border-gray-300 rounded-lg shadow-sm transition-transform duration-300 hover:shadow-md"
      onClick={handleClick}
    >
      <div className="pb-[150%] relative">
        <img
          src={book.coverImage || placeholderImage}
          alt={book.title}
          className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
        />
      </div>
      <div
        ref={titleRef}
        className="p-2 text-center whitespace-nowrap overflow-hidden"
        style={{ fontSize: `${fontSize}px` }}
      >
        {book.title}
      </div>
    </div>
  )
}

