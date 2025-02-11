"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Post } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { formatDistanceToNow, formatDistanceToNowStrict } from "date-fns";
import { ko } from "date-fns/locale";
import { getPostsByUserId } from "@/lib/api/";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/custom/TabGreen";
import { Button } from "@/components/ui/button";

export default function ActivitiesPage() {
  const handleBack = () => {
    router.back();
  };

  const router = useRouter();
  const { id: id } = useParams();
  const userId = Array.isArray(id) ? id[0] : id;
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsToShow, setPostsToShow] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");

  const fetchPosts = async () => {
    setIsLoading(true);
    const allPosts = await getPostsByUserId(userId);
    setPosts(allPosts);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const loadMorePosts = () => {
    setPostsToShow((prev) => prev + 5);
  };

  return (
    <div className="relative p-6 -mt-4">
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 p-2 text-xl text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft />
      </button>
      <h1 className="text-2xl font-bold text-center">활동 목록</h1>
      <Tabs 
        defaultValue="posts" 
        onValueChange={(value) => setActiveTab(value as "posts" | "comments")} 
        className="mt-6"
      >
        <TabsList className="flex justify-center space-x-4">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500">{posts.length}</p>
            <TabsTrigger value="posts">작성한 글</TabsTrigger>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500">0</p>
            <TabsTrigger value="comments">작성한 댓글</TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="posts">
          {activeTab === "posts" && (
            <div className="space-y-4 w-full mt-4">
              <PostList posts={posts.slice(0, postsToShow)} />
              {postsToShow < posts.length && (
                <div className="flex justify-center mt-4">
                  <Button 
                    variant="default" 
                    onClick={loadMorePosts} 
                    disabled={isLoading}
                  >
                    {isLoading ? "로딩 중..." : "더 보기"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        <TabsContent value="comments">
          {activeTab === "comments" && (
            <div className="space-y-4 w-full mt-4">
              <p className="text-center text-gray-500">작성한 댓글이 없습니다.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <Card key={post.id} className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
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
      ))}
    </div>
  );
}