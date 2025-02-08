"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import type { Post } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

import { useEffect } from "react";

interface FollowedPostsProps {
  posts: Post[];
}

// ✅ 랜덤 프로필 이미지 생성 함수
const getRandomImage = () => {
  const imageNumber = Math.floor(Math.random() * 9) + 1; // 1~9 숫자 랜덤 선택
  return `/corgis/placeholder${imageNumber}.jpg`; // public 폴더 내 이미지 경로
};

export default function FollowedPosts({ posts }: FollowedPostsProps) {
    const CATEGORY_MAP: Record<string, string> = {
      INFORMATION_SHARING: "정보 공유",
      QUESTION_DISCUSSION: "고민/질문",
    };

    const formattedPosts = posts.map((post) => ({
      ...post,
      category: CATEGORY_MAP[post.category] || post.category, // 변환되지 않으면 원래 값 유지
    }));

  // ✅ 카테고리별 색상 함수 (내부에서 정의)
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

  return (
    <div className="space-y-3">
      {formattedPosts.map((post) => (
        <Link key={post.id} href={`/today/${post.id}`} className="block">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{post.userName[0]}</AvatarFallback>
                    {/* ✅ 랜덤 프로필 이미지 적용 */}
                    <AvatarImage src={getRandomImage()} alt={post.userName} />
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{post.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}
                    </p>
                  </div>
                </div>
                {/* ✅ 카테고리별 배지 색상 적용 */}
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
