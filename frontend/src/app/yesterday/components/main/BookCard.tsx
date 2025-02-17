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
      className="flex border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer overflow-hidden h-48"
      onClick={handleClick}
    >
      <div className="w-1/3 relative">
      <Image 
        src={book.coverImage || placeholderImage} 
        alt={book.title} 
        fill 
        className="object-cover"
      />
      </div>
      <div className="w-2/3 p-4 flex flex-col justify-between">
        <div className="overflow-hidden">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{book.title}</h3>
          <div className="flex flex-wrap gap-1 mb-2 overflow-hidden max-h-12">
            {book.tags.slice(0, 3).map((tag, index) => (
              <div key={index} className="bg-brand text-white px-3 py-1 text-sm rounded-full shadow-sm">{tag}</div>
              // <span key={index} className="bg-spring-olive text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
              //   {tag}
              // </span>
            ))}
          </div>
        </div>
        <div className="mt-auto">
          <div className="flex items-center mb-2">
            {/* <Image
              src={book.authorProfileImage || "/placeholder/profile.png"}
              alt={book.authorNickname}
              width={24}
              height={24}
              className="rounded-full mr-2"
            /> */}
            <Avatar className="h-7 w-7 flex-shrink-0">
              <AvatarImage src={book.authorProfileImage} alt={'/placeholder/profile.png'} />
              <AvatarFallback>{book.authorNickname}</AvatarFallback>
            </Avatar>
            <span className="p-2 text-sm text-gray-600 truncate">{book.authorNickname}</span>
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

