"use client"

import Image from "next/image"
import { Heart, MessageCircle } from "lucide-react"
import type { Post } from "../types/posts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { useEffect, useState } from "react"

interface PopularPostsProps {
  posts: Post[]
}

export default function PopularPosts({ posts }: PopularPostsProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1)
    }

    api.on("select", onSelect)

    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  useEffect(() => {
    const interval = setInterval(() => {
      api?.scrollNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [api])

  return (
    <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
      <CarouselContent>
        {posts.map((post, index) => (
          <CarouselItem key={post.id}>
            <Card>
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <Avatar>
                  <AvatarImage src={post.author.profileImage} alt={post.author.name} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-sm font-medium">{post.author.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{post.author.generation}</p>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-bold text-sm mb-1">{post.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{post.content}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" /> {post.comments}
                  </span>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="py-2 text-center">
        {Array.from({ length: count }).map((_, index) => (
          <span
            key={index}
            className={`inline-block h-2 w-2 mx-1 rounded-full ${index === current - 1 ? "bg-primary" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </Carousel>
  )
}

