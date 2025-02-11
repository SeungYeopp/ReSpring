"use client";

import Link from "next/link";
import { Heart } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { getAllSubscribersActivities, Post } from "@/lib/api/subscribe";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { TodaySkeletonCarousel } from "./ui/TodaySkeletonCarousel";

const getRandomImage = () => {
  const imageNumber = Math.floor(Math.random() * 9) + 1;
  return `/corgis/placeholder${imageNumber}.jpg`;
};

export default function FollowedPosts() {
  const {userId} = useAuth(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!userId) return;

    const handleInitialSetting = async () => {
      setLoading(true);
      try {
        const result : Post[] = await getAllSubscribersActivities(userId);
        setPosts(result);
      } catch(error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    handleInitialSetting();
  }, [userId])

  const CATEGORY_MAP: Record<string, string> = {
    INFORMATION_SHARING: "정보 공유",
    QUESTION_DISCUSSION: "고민/질문",
  }

  const formattedPosts = posts.map((post) => ({
    ...post,
    category: CATEGORY_MAP[post.category] || post.category,
  }));

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "전체":
        return "bg-[#dfeaa5] text-[#638d3e]";
      case "고민/질문":
        return "bg-[#96b23c] text-white";
      case "정보 공유":
        return "bg-[#f2cedd] text-[#665048]";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  if (loading) {
    return <TodaySkeletonCarousel />;
  }

  if (posts.length === 0) {
    return <p className="text-muted-foreground text-sm">아직 구독한 사람이 없습니다.</p>;
  }

  return (
    <div className="space-y-3">
      {formattedPosts.map((post) => (
        <Link key={post.postId} href={`/today/${post.postId}`} className="block">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{post.authorName}</AvatarFallback>
                    <AvatarImage src={getRandomImage()} alt={post.authorName} />
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{post.authorName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}
                    </p>
                  </div>
                </div>
                <Badge className={`text-xs px-2 py-1 rounded-lg shadow-sm ${getCategoryColor(post.category)}`}>
                  {post.category}
                </Badge>
              </div>
              <h3 className="font-bold text-sm mb-1">{post.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{post.content}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3" /> {post.likes}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}