"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, ArrowLeft } from "lucide-react"
import { formatDistanceToNowStrict } from "date-fns"
import { ko } from "date-fns/locale"
import { getAllSubscribersActivities, type Post } from "@/lib/api/subscribe"
import { useAuth } from "@/hooks/useAuth"

/** 카테고리 타입 */
type Category = "전체" | "고민/질문" | "정보 공유"

/**   랜덤 프로필 이미지 생성 함수 */
const getRandomImage = () => {
  const imageNumber = Math.floor(Math.random() * 9) + 1
  return `/corgis/placeholder${imageNumber}.jpg`
}

/**
 * 커뮤니티 게시글 목록 페이지
 */
export default function CommunityPosts() {
  const { userNickname } = useAuth(true)
  const router = useRouter()

  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const CATEGORY_MAP: Record<string, Category> = {
    INFORMATION_SHARING: "정보 공유",
    QUESTION_DISCUSSION: "고민/질문",
    ALL: "전체",
  }

  /**   카테고리에 따른 뱃지 색상 */
  const getCategoryColor = (category: Category | string): string => {
    switch (category) {
      case "전체":
        return "bg-[#dfeaa5] text-[#638d3e]"
      case "고민/질문":
        return "bg-[#96b23c] text-white"
      case "정보 공유":
        return "bg-[#f2cedd] text-[#665048]"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  /**   전체 게시물 불러오기 */
  useEffect(() => {
    if (!userNickname) return

    const fetchPosts = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const newPosts = await getAllSubscribersActivities()
        const formattedPosts = newPosts.map((post) => ({
          ...post,
          category: (CATEGORY_MAP[post.category as keyof typeof CATEGORY_MAP] || "전체") as Category,
        }))
        setAllPosts(formattedPosts)
        setDisplayedPosts(formattedPosts)
      } catch (error) {
        console.error("Error fetching posts:", error)
        setError("게시물을 불러오는 데 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [userNickname])

  /**   카테고리 변경 시 필터링 */
  useEffect(() => {
    if (selectedCategory === "전체") {
      setDisplayedPosts(allPosts)
    } else {
      setDisplayedPosts(allPosts.filter((post) => post.category === selectedCategory))
    }
    window.scrollTo(0, 0)
  }, [selectedCategory, allPosts])

  return (
    <div className="space-y-4 p-4 max-w-2xl mx-auto">
      {/*   뒤로가기 버튼 */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> 뒤로가기
      </Button>

      <h1 className="text-2xl font-bold mb-6">커뮤니티 게시글</h1>

      {/*   카테고리 탭 */}
      <Tabs defaultValue={selectedCategory} onValueChange={(value) => setSelectedCategory(value as Category)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="전체">전체</TabsTrigger>
          <TabsTrigger value="고민/질문">고민/질문</TabsTrigger>
          <TabsTrigger value="정보 공유">정보공유</TabsTrigger>
        </TabsList>
      </Tabs>

      {/*   게시물 목록 */}
      <PostList posts={displayedPosts} getCategoryColor={getCategoryColor} getRandomImage={getRandomImage} />

      {/*   상태 처리 */}
      {isLoading && <p className="text-center py-4">게시물을 불러오는 중...</p>}
      {error && <p className="text-center py-4 text-red-500">{error}</p>}
      {!isLoading && !error && displayedPosts.length === 0 && <p className="text-center py-4">게시물이 없습니다.</p>}
    </div>
  )
}

/**
 *   PostList 컴포넌트 (게시물 리스트)
 */
function PostList({
  posts,
  getCategoryColor,
  getRandomImage,
}: {
  posts: Post[]
  getCategoryColor: (category: Category | string) => string
  getRandomImage: () => string
}) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Link key={post.postId} href={`/today/${post.postId}`} className="block">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{post.authorNickname[0]}</AvatarFallback>
                    <AvatarImage src={post.authorImage || getRandomImage()} alt={post.authorNickname} />
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{post.authorNickname}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNowStrict(new Date(post.createdAt), {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </p>
                  </div>
                </div>
                <Badge className={`text-xs px-2 py-1 rounded-lg shadow-sm ${getCategoryColor(post.category)}`}>
                  {post.category}
                </Badge>
              </div>

              <h3 className="font-bold text-lg mb-2">{post.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{post.content}</p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" /> {post.likes}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

