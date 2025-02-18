"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import type { Book } from "@/lib/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/yesterday/newbook/${book.id}`)
  }

  const placeholderImage = `/placeholder/bookcover/thumb (${Math.floor(Math.random() * 7) + 1}).webp`

  return (
    <div
      className="flex border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer overflow-hidden h-[192px]"
      onClick={handleClick}
    >
      <div className="relative w-[128px] flex-shrink-0">
        <Image src={book.coverImage || placeholderImage} alt={book.title} fill className="object-cover" />
      </div>
      <div className="flex-grow p-4 flex flex-col justify-between overflow-hidden">
        <div>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{book.title}</h3>
          <div className="flex flex-wrap gap-1 mb-2 overflow-hidden max-h-12">
            {book.tags.slice(0, 3).map((tag, index) => (
              <div
                key={index}
                className="bg-tag-purple font-semibold text-tag-darkpurple px-3 py-1 text-xs rounded-full shadow-sm"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-auto">
          <div className="flex items-center mb-2">
            <Avatar className="h-6 w-6 flex-shrink-0">
              <AvatarImage src={book.authorProfileImage} alt={book.authorNickname} />
              <AvatarFallback>{book.authorNickname[0]}</AvatarFallback>
            </Avatar>
            <span className="ml-2 text-sm text-gray-600 truncate">{book.authorNickname}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>좋아요 {book.likeCount}</span>
            <span>조회수 {book.viewCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

