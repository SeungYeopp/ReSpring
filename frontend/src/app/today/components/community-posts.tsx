"use client"

import { useState } from "react"
import Image from "next/image"
import type { Post, PostCategory } from "../types/posts"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle } from "lucide-react"

interface CommunityPostsProps {
  posts: Post[]
}

export default function CommunityPosts({ posts }: CommunityPostsProps) {
  const [category, setCategory] = useState<PostCategory>("전체")

  // 카테고리별 게시글 필터링
  const filteredPosts = category === "전체" ? posts : posts.filter((post) => post.category === category)

  return (
    <div>
      {/* 카테고리 탭 */}
      <Tabs value={category} className="w-full" onValueChange={(value) => setCategory(value as PostCategory)}>
        <TabsList className="w-full justify-start px-4 h-12">
          <TabsTrigger value="전체">전체</TabsTrigger>
          <TabsTrigger value="고민/질문">고민/질문</TabsTrigger>
          <TabsTrigger value="정보공유">정보공유</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 게시글 목록 */}
      <div className="divide-y">
        {filteredPosts.map((post) => (
          <article key={post.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Image
                  src={post.author.profileImage || "/placeholder.webp"}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <span className="font-medium">{post.author.name}</span>
                  {post.author.generation && (
                    <span className="text-sm text-muted-foreground ml-2">{post.author.generation}</span>
                  )}
                </div>
              </div>
              <Badge variant="outline">{post.category}</Badge>
            </div>
            <h3 className="font-medium mb-2">{post.title}</h3>
            <p className="text-muted-foreground mb-4 line-clamp-2">{post.content}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments}</span>
              </div>
              <time>2시간 전</time>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

