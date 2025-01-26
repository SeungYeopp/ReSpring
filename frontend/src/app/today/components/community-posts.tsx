"use client";

import Image from "next/image";
import type { Post } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { getAllPosts } from "@/lib/api";
import { useInView } from "react-intersection-observer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// 카테고리 타입 정의
type Category = "전체" | "고민/질문" | "INFORMATION SHARING";

export default function CommunityPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastId, setLastId] = useState<number | undefined>(undefined);
  const [ref, inView] = useInView();
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체");

  const fetchPosts = async () => {
    const newPosts = await getAllPosts(lastId);
    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setLastId(newPosts[newPosts.length - 1]?.id);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (inView) {
      fetchPosts();
    }
  }, [inView]);

  // 선택된 카테고리에 따라 게시물 필터링
  const filteredPosts = useMemo(() => {
    if (selectedCategory === "전체") return posts;
    return posts.filter((post) => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="전체" onValueChange={(value) => setSelectedCategory(value as Category)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="전체">전체</TabsTrigger>
          <TabsTrigger value="고민/질문">고민/질문</TabsTrigger>
          <TabsTrigger value="INFORMATION SHARING">정보공유</TabsTrigger>
        </TabsList>
        <TabsContent value="전체">
          <PostList posts={filteredPosts} />
        </TabsContent>
        <TabsContent value="고민/질문">
          <PostList posts={filteredPosts} />
        </TabsContent>
        <TabsContent value="INFORMATION SHARING">
          <PostList posts={filteredPosts} />
        </TabsContent>
      </Tabs>
      <div ref={ref} className="h-10" /> {/* Intersection Observer 타겟 */}
    </div>
  );
}

function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <Card key={post.id} className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>{post.userName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{post.userName}</p>
                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {post.category}
              </Badge>
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
      ))}
    </div>
  );
}
