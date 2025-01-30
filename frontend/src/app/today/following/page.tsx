"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { getAllPosts } from "@/lib/api";
import type { Post } from "@/lib/api";

/** 카테고리 타입 (카테고리 확장이 필요하면 union에 추가) */
type Category = "전체" | "고민/질문" | "INFORMATION_SHARING";

/**
 * 커뮤니티 게시글 목록 페이지 (단일 Fetch + 클라이언트 필터링 버전)
 */
export default function CommunityPosts() {
  /** 전체 게시물: 서버에서 모두 받아옴 */
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  /** 현재 표시 중인 게시물: 카테고리에 따라 필터링된 결과 */
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);

  /** 현재 선택된 카테고리 상태 */
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체");

  /** 로딩 / 에러 상태 */
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** 우리가 사용할 수 있는 유효한 카테고리 목록 (데이터 정합성 체크용) */
  const VALID_CATEGORIES: Category[] = ["전체", "고민/질문", "INFORMATION_SHARING"];

  /**
   * 카테고리에 따른 뱃지 색상
   * (디자인, 테마에 맞춰 자유롭게 수정)
   */
  const getCategoryColor = (category: Category): string => {
    switch (category) {
      case "전체":
        return "bg-[#dfeaa5] text-[#638d3e]";
      case "고민/질문":
        return "bg-[#96b23c] text-white";
      case "INFORMATION_SHARING":
        return "bg-[#f2cedd] text-[#665048]";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  /**
   * 1) 페이지 최초 렌더링 시 전체 게시물을 불러온다.
   * - "무한 스크롤" 없이, 한꺼번에 다 받아오는 구조.
   */
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const newPosts = await getAllPosts();

        // ✅ 서버에서 온 데이터 중 category 값을 Category 타입으로 변환
        const formattedPosts: Post[] = newPosts.map((post) => ({
          ...post,
          category: (["전체", "고민/질문", "INFORMATION_SHARING"].includes(post.category) ? post.category : "전체") as Category, // ⛔ 여기서 변환
        }));

        setAllPosts(formattedPosts);
        setDisplayedPosts(formattedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("게시물을 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  /**
   * 2) 선택된 카테고리가 바뀔 때마다, allPosts에서 필터링
   */
  useEffect(() => {
    if (selectedCategory === "전체") {
      setDisplayedPosts(allPosts);
    } else {
      setDisplayedPosts(allPosts.filter((post) => post.category === selectedCategory));
    }

    // UX: 카테고리를 바꿨을 때 화면을 맨 위로 올림
    window.scrollTo(0, 0);
  }, [selectedCategory, allPosts]);

  return (
    <div className="space-y-4">
      {/* ✅ 카테고리 탭 */}
      <Tabs defaultValue={selectedCategory} onValueChange={(value) => setSelectedCategory(value as Category)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="전체">전체</TabsTrigger>
          <TabsTrigger value="고민/질문">고민/질문</TabsTrigger>
          <TabsTrigger value="INFORMATION_SHARING">정보공유</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ✅ 게시물 목록 렌더링 */}
      <PostList posts={displayedPosts} getCategoryColor={getCategoryColor} />

      {/* ✅ 로딩, 에러, 게시물 없음 상태 처리 */}
      {isLoading && <p className="text-center py-4">게시물을 불러오는 중...</p>}
      {error && <p className="text-center py-4 text-red-500">{error}</p>}
      {!isLoading && !error && displayedPosts.length === 0 && <p className="text-center py-4">게시물이 없습니다.</p>}
    </div>
  );
}

/**
 * 게시물 목록 UI를 분리한 컴포넌트
 * - 필요하면 별도 파일로 빼도 됨
 */
function PostList({ posts, getCategoryColor }: { posts: Post[]; getCategoryColor: (category: Category) => string }) {
  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <Link key={post.id} href={`/today/${post.id}`} className="block">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{post.userName?.[0] ?? "?"}</AvatarFallback>
                    <AvatarImage src="" alt={post.userName} />
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{post.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </p>
                  </div>
                </div>
                {/* ✅ 카테고리 뱃지 */}
                <Badge className={`text-xs px-2 py-1 rounded-lg shadow-sm ${getCategoryColor(post.category as Category)}`}>{post.category}</Badge>
              </div>

              {/* 제목 / 내용 */}
              <h3 className="font-bold text-sm mb-1">{post.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{post.content}</p>

              {/* 좋아요 수 등 메타 정보 */}
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
