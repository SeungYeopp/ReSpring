"use client";

import type { Post } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { ko } from "date-fns/locale";
import { getPostsByUserId } from "@/lib/api";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CommunityPosts({ userId }: { userId: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [ref, inView] = useInView();

  const fetchPosts = async () => {
    try {
      const userPosts = await getPostsByUserId(userId);
      setPosts(userPosts);
    } catch (error) {
      console.error("Failed to fetch user posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  return (
    <div className="space-y-4 w-full">
      <PostList posts={posts.slice(0, 5)} />
      <div className="flex justify-center mt-4">
        <Link href={`/profile/${userId}/activities`}>
          <Button variant="default">더 보기</Button>
        </Link>
      </div>
      <div ref={ref} className="h-10" />
    </div>
  );
}

function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <Link key={post.id} href={`/today/${post.id}`} className="block">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs px-2 py-1">{post.category}</Badge>
                <h3 className="text-sm font-semibold flex-1 text-center truncate">{post.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNowStrict(new Date(post.createdAt), { addSuffix: true, locale: ko })}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{post.content}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}