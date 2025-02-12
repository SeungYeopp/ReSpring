"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type Comment = {
  id: number
  author: string
  avatar: string
  content: string
  date: string
  likes: number
  replies?: Comment[]
}


 /** ✅ 랜덤 프로필 이미지 생성 함수 */
 const getRandomImage = () => {
  const imageNumber = Math.floor(Math.random() * 9) + 1; // 1~9 숫자 랜덤 선택
  return `/corgis/placeholder${imageNumber}.jpg`; // public 폴더 내 이미지 경로
};

export default function Comments({ bookId }: { bookId: string }) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "독자1",
      avatar: getRandomImage(),
      content: "정말 감동적인 이야기였습니다. 작가님의 경험이 저에게도 큰 울림이 되었어요.",
      date: "2023-10-26",
      likes: 12,
      replies: [
        {
          id: 3,
          author: "작가",
          avatar: getRandomImage(),
          content: "감사합니다. 독자님의 말씀에 큰 힘이 됩니다.",
          date: "2023-10-26",
          likes: 5,
        },
      ],
    },
    {
      id: 2,
      author: "독자2",
      avatar: getRandomImage(),
      content: "다음 이야기가 기대됩니다!",
      date: "2023-10-25",
      likes: 8,
    },
    {
      id: 4,
      author: "독자3",
      avatar: getRandomImage(),
      content: "작가님의 글쓰기 스타일이 정말 좋아요.",
      date: "2023-10-24",
      likes: 10,
    },
  ])

  const [sortBy, setSortBy] = useState<"likes" | "date">("likes")
  const [expandedComments, setExpandedComments] = useState<number[]>([])

  const handleLike = (commentId: number) => {
    setComments(comments.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c)))
  }

  const toggleReplies = (commentId: number) => {
    setExpandedComments((prev) =>
      prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId],
    )
  }

  const sortedComments = useMemo(() => {
    return [...comments].sort((a, b) => {
      if (sortBy === "likes") {
        return b.likes - a.likes
      } else {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    })
  }, [comments, sortBy])

  const renderComment = (comment: Comment, isReply = false) => (
    <Card key={comment.id} className={`mb-4 ${isReply ? "ml-12" : ""} border border-border bg-background`}>
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={comment.avatar} />
          <AvatarFallback>{comment.author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{comment.author}</span>
              {!isReply && sortBy === "likes" && <Badge variant="secondary">BEST</Badge>}
            </div>
            <span className="text-xs text-muted-foreground">{comment.date}</span>
          </div>
          <p className="text-sm">{comment.content}</p>
        </div>
      </CardHeader>
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center gap-4 text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleLike(comment.id)}
            className="text-muted-foreground hover:text-primary"
          >
            <Heart className="w-4 h-4 mr-1" fill={comment.likes > 0 ? "currentColor" : "none"} />
            {comment.likes}
          </Button>
          {!isReply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleReplies(comment.id)}
              className="text-muted-foreground hover:text-primary"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              답글 {comment.replies?.length || 0}
              {expandedComments.includes(comment.id) ? (
                <ChevronUp className="w-3 h-3 ml-1" />
              ) : (
                <ChevronDown className="w-3 h-3 ml-1" />
              )}
            </Button>
          )}
          <Button variant="ghost" size="sm" className="ml-auto p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )

  const totalComments = comments.reduce((acc, comment) => acc + 1 + (comment.replies?.length || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">전체 {totalComments}개</span>
        <Select defaultValue="likes" onValueChange={(value) => setSortBy(value as "likes" | "date")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="likes">인기순</SelectItem>
            <SelectItem value="date">최신순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {sortedComments.map((comment, index) => (
          <div key={comment.id}>
            {renderComment(comment)}
            {expandedComments.includes(comment.id) && comment.replies?.map((reply) => renderComment(reply, true))}
            {index < sortedComments.length - 1 && <Separator className="my-6" />}
          </div>
        ))}
      </div>
    </div>
  )
}

