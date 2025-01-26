"use client";

import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import type { Post } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface PopularPostsProps {
  posts: Post[];
}

export default function PopularPosts({ posts }: PopularPostsProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    const interval = setInterval(() => {
      api?.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
      <CarouselContent>
        {posts.map((post) => (
          <CarouselItem key={post.id}>
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-3">
                <div className="flex items-center space-x-3 mb-2">
                  <Avatar>
                    <AvatarFallback>{post.userName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{post.userName}</p>
                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}</p>
                  </div>
                </div>
                <h3 className="font-bold text-sm mb-1">{post.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{post.content}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {post.likes}
                  </span>
                  {/* 댓글 수는 API에서 제공되지 않아 임시로 제거 */}
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="py-2 text-center">
        {Array.from({ length: count }).map((_, index) => (
          <span key={index} className={`inline-block h-2 w-2 mx-1 rounded-full ${index === current - 1 ? "bg-primary" : "bg-gray-300"}`} />
        ))}
      </div>
    </Carousel>
  );
}
