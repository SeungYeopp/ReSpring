"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { getAllPosts } from "@/lib/api";

type Category = "전체" | "고민/질문" | "INFORMATION_SHARING";

interface Post {
  id: number;
  title: string;
  content: string;
  category: Category;
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  images: string[];
}

export default function CommunityPosts() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ref, inView] = useInView();

  const VALID_CATEGORIES: Category[] = ["전체", "고민/질문", "INFORMATION_SHARING"];

  // ✅ 랜덤 이미지 생성 함수 (이제 PostList에 props로 전달)
  const getRandomImage = () => {
    const imageNumber = Math.floor(Math.random() * 9) + 1; // 1~9 숫자 랜덤 선택
    return `/corgis/placeholder${imageNumber}.jpg`; // public 폴더 내 이미지 경로
  };

  // ✅ 카테고리별 색상 함수
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

  // ✅ 전체 게시물 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const newPosts = await getAllPosts();
        const formattedPosts = newPosts.map((post) => ({
          ...post,
          category: VALID_CATEGORIES.includes(post.category as Category) ? (post.category as Category) : "전체",
        }));

        setAllPosts(formattedPosts);
        setPosts(formattedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("게시물을 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // ✅ 카테고리 변경 시 필터링 적용
  useEffect(() => {
    if (selectedCategory === "전체") {
      setPosts(allPosts);
    } else {
      setPosts(allPosts.filter((post) => post.category === selectedCategory));
    }
    window.scrollTo(0, 0);
  }, [selectedCategory, allPosts]);

  return (
    <div className="space-y-4">
      {/* 🔹 카테고리 탭 */}
      <Tabs defaultValue="전체" onValueChange={(value) => setSelectedCategory(value as Category)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="전체">전체</TabsTrigger>
          <TabsTrigger value="고민/질문">고민/질문</TabsTrigger>
          <TabsTrigger value="INFORMATION_SHARING">정보공유</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 🔹 게시물 목록 (getRandomImage를 props로 전달) */}
      <PostList posts={posts} getCategoryColor={getCategoryColor} getRandomImage={getRandomImage} />

      {/* 🔹 로딩, 에러, 게시물 없음 표시 */}
      {isLoading && <p className="text-center py-4">게시물을 불러오는 중...</p>}
      {error && <p className="text-center py-4 text-red-500">{error}</p>}
      {!isLoading && !error && posts.length === 0 && <p className="text-center py-4">게시물이 없습니다.</p>}

      {/* 🔹 Intersection Observer (무한 스크롤용) */}
      <div ref={ref} className="h-10" />
    </div>
  );
}

/**
 * ✅ PostList 컴포넌트
 * - 게시물 목록을 렌더링
 * - 각 게시물 카드를 클릭하면 상세 페이지(`/today/[id]`)로 이동
 */
function PostList({
  posts,
  getCategoryColor,
  getRandomImage, // ✅ getRandomImage props 추가
}: {
  posts: Post[];
  getCategoryColor: (category: Category) => string;
  getRandomImage: () => string;
}) {
  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <Link key={post.id} href={`/today/${post.id}`} className="block">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{post.userName[0]}</AvatarFallback>
                    {/* ✅ 프로필 아바타 랜덤 이미지 적용 */}
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
              {/* ✅ 게시물 이미지 랜덤 적용 */}
              {post.images.length > 0 && (
                <img
                  src={post.images[0]} // 첫 번째 이미지만 표시
                  alt="게시물 이미지"
                  className="w-full h-40 object-cover rounded-lg mt-2"
                />
              )}
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
