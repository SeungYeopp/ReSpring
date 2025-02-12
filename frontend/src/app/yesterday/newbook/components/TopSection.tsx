"use client"

import Image from "next/image"
import { ChevronLeft, Home, Heart, MoreVertical, Pencil, Trash, User, EyeIcon } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { getBookById, Book } from "@/lib/api/book" // API 호출 및 타입 import

export default function TopSection({ bookId }: { bookId: string }) {
  const [book, setBook] = useState<Book | null>(null) // API 데이터 저장
  const [isLiked, setIsLiked] = useState(false)
  const [isImageExpanded, setIsImageExpanded] = useState(false)
  const [isHeartAnimating, setIsHeartAnimating] = useState(false)

  // 페이지에 하드코딩된 User ID
  const userId = "beb9ebc2-9d32-4039-8679-5d44393b7252"; // 박싸피의 테스트 ID

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookData = await getBookById(Number(bookId), userId)  // 하드코딩된 userId 사용
        setBook(bookData)
        setIsLiked(bookData.liked) // 초기 좋아요 상태 설정
      } catch (error) {
        console.error("책 데이터를 불러오는 중 오류 발생:", error)
      }
    }
    fetchBook()
  }, [bookId, userId])  // userId가 의존성에 포함됨

  const handleImageClick = () => {
    setIsImageExpanded(true)
    setTimeout(() => {
      window.location.href = `/viewer/${bookId}`
    }, 500)
  }

  useEffect(() => {
    if (!isLiked) {
      const interval = setInterval(() => {
        setIsHeartAnimating(true)
        setTimeout(() => setIsHeartAnimating(false), 1000)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isLiked])

  if (!book) return <div>로딩 중...</div> // 데이터 로딩 중 표시

  return (
    <section className="relative min-h-[80vh] text-white">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black">
        <Image
          src={book.coverImage || "/placeholder.svg"}
          alt="cover image"
          layout="fill"
          objectFit="cover"
          className="opacity-30 blur-md"
        />
      </div>

      {/* 상단 네비게이션 */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="text-white hover:text-white/80">
            <Link href="/books">
              <ChevronLeft className="w-6 h-6" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="text-white hover:text-white/80">
            <Link href="/">
              <Home className="w-6 h-6" />
            </Link>
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
              <MoreVertical className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              <span>편집하기</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash className="mr-2 h-4 w-4" />
              <span>삭제하기</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 컨텐츠 */}
      <div className="relative z-10 flex flex-col items-center px-4 pt-20">
        {/* 표지 이미지 */}
        <Card
          onClick={handleImageClick}
          className={cn(
            "cursor-pointer transition-all duration-500 ease-in-out w-[240px]",
            isImageExpanded ? "fixed inset-0 z-50 bg-black w-full h-full flex items-center justify-center" : "relative",
          )}
        >
          <CardContent className="p-0">
            <AspectRatio ratio={156 / 234}>
              <Image
                src={book.coverImage || "/placeholder.svg"}
                alt={book.title}
                fill
                className={cn(
                  "rounded-lg object-cover transition-all duration-500 ease-in-out",
                  isImageExpanded ? "object-contain" : "object-cover",
                )}
              />
            </AspectRatio>
          </CardContent>
        </Card>

        <h1 className="text-2xl font-bold text-center mb-4 mt-6">{book.title}</h1>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {book.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href={`/profile/${book.authorId}`} className="flex items-center gap-1 text-white hover:underline">
            <User className="w-4 h-4" />
            <span>작성자 ID: {book.authorId}</span> {/* 나중에 닉네임으로 수정 가능 */}
          </Link>
          <div className="flex items-center gap-1">
            <EyeIcon className="w-5 h-5" />
            <span>{book.viewCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn("p-0 text-white hover:text-white/80", isHeartAnimating && !isLiked && "animate-bounce")}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={cn("w-5 h-5", isLiked && "fill-red-500 text-red-500")} />
            </Button>
            <span>{book.likeCount}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
