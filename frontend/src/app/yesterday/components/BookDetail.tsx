"use client"

import Image from "next/image"
import { ArrowLeft, MessageSquare, Heart, BookIcon, Eye, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import type { BookFull } from "@/lib/api"
import { getBookById, likeOrUnlikeBook } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

interface BookDetailProps {
  bookId: string
}

export default function BookDetail({ bookId }: BookDetailProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [likeCount, setLikeCount] = useState<number>(240)
  const [book, setBook] = useState<BookFull>()

  const { userId, userNickname } = useAuth(true)
  const router = useRouter()

  useEffect(() => {
    if (!userId) return

    const getBook = async () => {
      try {
        const result = await getBookById(parseInt(bookId, 10))
        setBook(result)
        setLikeCount(result.likeCount)

        const resultLiked = await likeOrUnlikeBook(parseInt(bookId, 10))

        if (resultLiked === "Liked") { // 좋아요를 안 누른 경우 확인.
          setIsLiked(false)
          await likeOrUnlikeBook(parseInt(bookId, 10)) // 좋아요를 누른 경우 확인.
        } else if (resultLiked === "Unliked") {
          setIsLiked(true)
          await likeOrUnlikeBook(parseInt(bookId, 10))
        }
      } catch (error) {
        console.error(error)
      }
    }
    getBook()
  }, [userId])

  const handleLike = async () => {
    try {
      const result = await likeOrUnlikeBook(book!.id)

      if (result === "Liked") {
        setIsLiked(true)
      } else if (result === "Unliked") {
        setIsLiked(false)
      }
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed)
  }

  const handleChatButtonClick = () => {
    router.push("/chat")
  }

  const handleViewerClick = () => {
    router.push(`/viewer/${bookId}`)
  }

  const handleBeforeClick = () => {
    router.back()
  }

  const handleProfileClick = () => {
    router.push(`/profile/${book?.authorNickname}`)
  }

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-gradient-to-b from-brand-light/20 to-white">
      {/* Header */}
      <div className="p-4 relative">
        <button className="absolute left-4 top-4 text-brand hover:text-brand-dark transition-colors" onClick={handleBeforeClick}>
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Book Title and Date */}
        <div className="text-center px-4 pt-8">
          <h1 className="text-xl font-bold mb-2">{book?.title}</h1>
          <p className="text-gray-500 text-sm">{book?.createdAt?.toLocaleDateString()}</p>
        </div>

        {/* Book Cover */}
        <div className="p-4">
          <div className="relative aspect-[3/4] max-w-[150px] mx-auto rounded-lg overflow-hidden shadow-lg">
            {book && book.coverImage && (
              <img
                src={book.coverImage}
                alt={book.coverImage}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="px-4 flex flex-wrap gap-2 justify-center">
          {book?.tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-brand text-white rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 p-4 text-gray-600">
          <div className="flex items-center gap-1">
            <Eye className="w-5 h-5" />
            <span>{book?.viewCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className={`w-5 h-5 ${isLiked ? "text-red-500 fill-red-500" : ""}`} />
            <span>{likeCount}</span>
          </div>
        </div>

        {/* Author Section */}
        <div className="p-4 mt-2">
          <div className="rounded-xl border border-brand/20 p-4 bg-white">
            <div className="flex items-center justify-between">
              {/* 프로필 사진과 이름을 하나의 버튼으로 묶기 */}
              <button
                className="flex items-center gap-3 focus:outline-none hover:bg-brand/10 hover:shadow-lg transition-all py-2 px-4 rounded-lg text-brand-dark font-medium"
                onClick={handleProfileClick} // 클릭 시 동작할 함수
              >
                {/* 프로필 사진 */}
                <div className="w-12 h-12 rounded-full overflow-hidden relative">
                  <Image src="/placeholder_profilepic.png" alt="Author" fill className="object-cover" />
                </div>

                {/* 사람 이름 */}
                <span>김싸피</span>
              </button>

              {userNickname !== book?.authorNickname && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className={`transition-all ${isSubscribed ? "bg-brand/10 text-brand border-brand" : "bg-brand text-white hover:bg-brand-dark"}`}
                    onClick={handleSubscribe}
                  >
                    {isSubscribed ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        구독중
                      </>
                    ) : (
                      "구독"
                    )}
                  </Button>
                  <Button variant="outline" className="border-brand text-brand hover:bg-brand/10 transition-all" onClick={handleChatButtonClick}>
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 flex flex-col gap-2 max-w-md mx-auto">
          <Button className="w-full bg-brand hover:bg-brand-dark transition-all py-6 text-lg" onClick={handleViewerClick}>
            <BookIcon className="w-5 h-5 mr-2" />
            읽기
          </Button>
          <Button
            variant="outline"
            className={`w-full py-6 text-lg ${
              isLiked ? "bg-brand text-white hover:bg-brand-dark" : "border-brand text-brand hover:bg-brand/10"
            } transition-all`}
            onClick={handleLike}
          >
            <Heart className={`w-5 h-5 mr-2`} />
            {isLiked ? "좋아요 취소" : "좋아요"}
          </Button>
        </div>
      </div>
    </div>
  )
}
