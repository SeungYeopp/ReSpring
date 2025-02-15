"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNowStrict } from "date-fns";
import { ko } from "date-fns/locale";
import type { Comment, Post, UserInfo } from "@/lib/api";
import { getPostsByUserId, getCommentsByUserId, getSessionInfo } from "@/lib/api/";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/custom/TabGreen";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CommunityPosts({ userNickname }: { userNickname: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [postsToShow, setPostsToShow] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const userInfo = await getSessionInfo();
      setUserInfo(userInfo);
      const allPosts = await getPostsByUserId(userInfo.userNickname);
      setPosts(allPosts);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComments = async () => {
    setIsLoading(true);
    const allComments = await getCommentsByUserId(userNickname);
    setComments(allComments);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    fetchComments();
  }, []);

  const loadMorePosts = () => {
    setPostsToShow((prev) => prev + 5);
  };

  return (
    <div className="relative">
      <Tabs 
        defaultValue="posts" 
        onValueChange={(value) => setActiveTab(value as "posts" | "comments")}
      >
        <TabsList className="flex justify-center md:justify-start -mt-4 space-x-4">
          <div className="flex flex-col items-center">
            <TabsTrigger value="posts" className="flex flex-col items-center">
              <div>작성한 글</div>
            </TabsTrigger>
          </div>
          <div className="flex flex-col items-center">
            <TabsTrigger value="comments" className="flex flex-col items-center">
              <div>작성한 댓글</div>
            </TabsTrigger>
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
              <CommentList comments={comments} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p className="text-center text-gray-500 mt-4">작성한 글이 없습니다.</p>;
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <Link key={post.id} href={`/today/${post.id}`} passHref>
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-center my-2">
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-semibold truncate">{post.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {post.content}
                  </p>
                </div>
                <div className="flex flex-col ml-4 items-end text-right">
                  <Badge variant="outline" className="text-xs px-2 py-1 mb-4">{post.category}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNowStrict(new Date(post.updatedAt), { addSuffix: true, locale: ko })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function CommentList({ comments }: { comments: Comment[] }) {
  return (
    <div className="space-y-3">
      {comments.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">작성한 댓글이 없습니다.</p>
      ) : (
        comments.map((comment) => (
          <Link key={comment.id} href={`/today/${comment.postId}`} passHref>
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex justify-between items-center my-2">
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold truncate">
                      {comment.content}
                    </p>
                  </div>
                  <div className="flex flex-col ml-4 items-end text-right">
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNowStrict(new Date(comment.updatedAt), { addSuffix: true, locale: ko })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
}