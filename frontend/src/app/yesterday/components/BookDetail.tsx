"use client"

import Image from "next/image"
import { ArrowLeft, MessageSquare, Heart, BookIcon, Eye, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import type { Book } from "@/lib/api"
import { getBookById, likeOrUnlikeBook } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

interface BookDetailProps {
  bookId: string
}

export default function BookDetail({ bookId }: BookDetailProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [likeCount, setLikeCount] = useState<number>(240)
  const [book, setBook] = useState<Book>()

  const {userId} = useAuth(true);

  useEffect(() => {
    if(!userId)
        return;
    const getBook = async () => {
      try {
        const result = await getBookById(bookId)
        setLikeCount(result.likeCount)
        setBook(result)

        // const resultLiked = await likeOrUnlikeBook(bookId, userId);
        // console.log(resultLiked)
        // if(resultLiked === 'Liked'){
        //     setIsLiked(false)
        //     await likeOrUnlikeBook(book!.id, userId);
        // }else if(resultLiked === 'Unliked'){
        //     setIsLiked(true)
        //     await likeOrUnlikeBook(book!.id, userId);
        // }
      } catch (error) {
        console.error(error)
      }
    }
    getBook()
  }, [userId])

  const handleLike = async () => {
    try{
        const result = await likeOrUnlikeBook(book!.id, userId);

        if(result === 'Liked'){
            setIsLiked(true)
        }else if(result === 'Unliked'){
            setIsLiked(false)
        }
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
    }catch(error){
        console.error(error);
    }
  }

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed)
  }

  return (
    <div className="max-w-md mx-auto bg-white h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 relative">
        <button className="absolute left-4 top-4 text-brand hover:text-brand-dark transition-colors">
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
            <Image src={"/placeholder_bookcover.jpg"} alt="Book Cover" fill className="object-cover" />
          </div>
        </div>

        {/* Tags */}
        <div className="px-4 flex flex-wrap gap-2 justify-center">
          {book?.tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-brand/10 text-brand rounded-full text-sm">
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
            <Heart className="w-5 h-5" />
            <span>{likeCount}</span>
          </div>
        </div>

        {/* Author Section */}
        <div className="p-1 mt-4">
          <div className="rounded-xl border border-brand/20 p-4 bg-brand/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden relative">
                  <Image src="/placeholder_profilepic.png" alt="Author" fill className="object-cover" />
                </div>
                <span className="font-medium">김싸피</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className={`transition-all ${
                    isSubscribed ? "bg-brand/10 text-brand border-brand" : "bg-brand text-white hover:bg-brand-dark"
                  }`}
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
                <Button variant="outline" className="border-brand text-brand hover:bg-brand/10 transition-all">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 flex flex-col gap-2 max-w-md mx-auto">
          <Button className="w-full bg-brand hover:bg-brand-dark transition-all py-6 text-lg">
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
            <Heart className={`w-5 h-5 mr-2 ${isLiked ? "fill-white" : ""}`} />
            {isLiked ? "좋아요 취소" : "좋아요"}
          </Button>
        </div>
      </div>
    </div>
  )
}

