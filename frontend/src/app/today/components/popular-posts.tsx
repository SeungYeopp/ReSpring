"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Heart } from "lucide-react"

// 인기글 타입 정의
interface PopularPost {
  id: number
  author: {
    name: string
    image: string
  }
  title: string
  content: string
  likes: number
  comments: number
  tag: string
}

// 더미 데이터 (나중에 API로 대체)
const dummyPopularPosts: PopularPost[] = [
  {
    id: 1,
    author: {
      name: "실버맨",
      image: "/placeholder.svg",
    },
    title: "퇴직금 제대로 관리하기: 재테크 노하우 공유",
    content:
      "안녕하세요. 실버맨입니다. 오늘은 더 나은 노하우가 있으시면 공유받길 바라며 제가 퇴직금을 관리하는 방법에 대해 이야기하고자 합니다....",
    likes: 19,
    comments: 3,
    tag: "정보 공유",
  },
  // 더 많은 더미 데이터...
]

export default function PopularPosts() {
  const [currentSlide, setCurrentSlide] = useState(0)

  return (
    <div className="relative">
      {/* 게시글 슬라이더 */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {dummyPopularPosts.map((post) => (
            <Card key={post.id} className="flex-shrink-0 w-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src={post.author.image || "/placeholder.svg"}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{post.author.name}</p>
                    <span className="text-sm text-muted-foreground">{post.tag}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                <p className="text-muted-foreground mb-4">{post.content}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">{post.comments}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 슬라이드 인디케이터 */}
      <div className="flex justify-center gap-2 mt-4">
        {dummyPopularPosts.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${currentSlide === index ? "bg-primary" : "bg-muted"}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

