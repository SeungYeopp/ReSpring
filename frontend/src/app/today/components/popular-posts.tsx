"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, MessageCircle } from "lucide-react"
import type { Post } from '../types/posts'

interface PopularPostsProps {
  posts: Post[]
}

export default function PopularPosts({ posts }: PopularPostsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div className="relative">
      {/* 현재 선택된 게시글 */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <Image
            src={posts[currentIndex].author.profileImage || "/placeholder.webp"}
            alt={posts[currentIndex].author.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-medium">{posts[currentIndex].author.name}</span>
        </div>
        <h3 className="font-bold text-lg mb-2">{posts[currentIndex].title}</h3>
        <p className="text-muted-foreground line-clamp-2 mb-4">{posts[currentIndex].content}</p>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{posts[currentIndex].likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{posts[currentIndex].comments}</span>
          </div>
        </div>
      </div>

      {/* 슬라이더 인디케이터 */}
      <div className="flex justify-center gap-2 mt-4">
        {posts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"}`}
          />
        ))}
      </div>
    </div>
  )
}

