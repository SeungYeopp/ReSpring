"use client"

import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import { getAllPosts, Post } from "@/lib/api"

type Category = "전체" | "고민/질문" | "정보 공유"

export default function CommunityPosts() {
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ref, inView] = useInView()

  const VALID_CATEGORIES: Category[] = ["전체", "고민/질문", "정보 공유"]

  const CATEGORY_MAP: Record<string, string> = {
    INFORMATION_SHARING: "정보 공유",
    QUESTION_DISCUSSION: "고민/질문",
  };

  const getRandomImage = () => {
    const imageNumber = Math.floor(Math.random() * 9) + 1
    return `/corgis/placeholder${imageNumber}.jpg`
  }

  const getCategoryColor = (category: string): string => {
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

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const newPosts = await getAllPosts(50, 10)
        const formattedPosts = newPosts.map((post) => ({
          ...post,
          category: CATEGORY_MAP[post.category] || post.category,
        }))

        setAllPosts(formattedPosts)
        setPosts(formattedPosts)
      } catch (error) {
        console.error("Error fetching posts:", error)
        setError("게시물을 불러오는 데 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    if (selectedCategory === "전체") {
      setPosts(allPosts)
    } else {
      setPosts(allPosts.filter((post) => post.category === selectedCategory))
    }
    window.scrollTo(0, 0)
  }, [selectedCategory, allPosts])

  return (
    <div className="space-y-4">
      <Tabs defaultValue="전체" onValueChange={(value) => setSelectedCategory(value as Category)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="전체">전체</TabsTrigger>
          <TabsTrigger value="고민/질문">고민/질문</TabsTrigger>
          <TabsTrigger value="정보 공유">정보공유</TabsTrigger>
        </TabsList>
      </Tabs>

      <PostList posts={posts} getCategoryColor={getCategoryColor} getRandomImage={getRandomImage} />

      {isLoading && <p className="text-center py-4">게시물을 불러오는 중...</p>}
      {error && <p className="text-center py-4 text-red-500">{error}</p>}
      {!isLoading && !error && posts.length === 0 && <p className="text-center py-4">게시물이 없습니다.</p>}

      <div ref={ref} className="h-10" />
    </div>
  )
}

function PostList({
  posts,
  getCategoryColor,
  getRandomImage,
}: {
  posts: Post[]
  getCategoryColor: (category: string) => string
  getRandomImage: () => string
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {posts.map((post) => (
        <Link key={post.id} href={`/today/${post.id}`} className="block">
          <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{post.userName[0]}</AvatarFallback>
                    <AvatarImage src={getRandomImage()} alt={post.userName} />
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{post.userName}</p>
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
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2 flex-grow">{post.content}</p>
              {/* 이미지 목 데이터, 나중에 바꿔야함*/}
              {post.images.length > 0 && (
                <img
                  src="/corgis/placeholder3.jpg"
                  alt="게시물 이미지"
                  className="w-full h-32 object-cover rounded-lg mb-2"
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
  )
}

