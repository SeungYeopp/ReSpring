"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Heart } from "lucide-react"

// 게시글 타입 정의
interface Post {
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
const dummyPosts: Post[] = [
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
  {
    id: 2,
    author: {
      name: "제2의 인생 누비",
      image: "/placeholder.svg",
    },
    title: "다들 무슨 취미를 갖고 계신가요?",
    content:
      "안녕하세요. 퇴직한지 4개월차가 되어가는 누비입니다. 특히 요즘 건강과 관련해서 스포츠를 알아보고 있는데...",
    likes: 12,
    comments: 3,
    tag: "고민/질문",
  },
  {
    id: 3,
    author: {
      name: "행복한 은퇴자",
      image: "/placeholder.svg",
    },
    title: "오늘의 산책 루트 공유합니다",
    content: "오늘 아침 일찍 일어나 동네 한 바퀴를 돌았어요. 벚꽃이 피기 시작했더라구요. 여러분도 봄을 만끽하세요!",
    likes: 15,
    comments: 5,
    tag: "정보 공유",
  },
  // 더 많은 더미 데이터...
]

interface AllPostsProps {
  filter: "all" | "concerns" | "info"
}

export default function AllPosts({ filter }: AllPostsProps) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])

  useEffect(() => {
    if (filter === "all") {
      setFilteredPosts(dummyPosts)
    } else {
      const filtered = dummyPosts.filter((post) =>
        filter === "concerns" ? post.tag === "고민/질문" : post.tag === "정보 공유",
      )
      setFilteredPosts(filtered)
    }
  }, [filter])

  return (
    <div className="space-y-4">
      {filteredPosts.map((post) => (
        <Card key={post.id}>
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
  )
}

