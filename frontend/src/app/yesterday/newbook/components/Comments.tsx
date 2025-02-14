"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getBookById, BookFull } from "@/lib/api/book"
import { Comment } from "@/lib/api/today" // 실제 Comment 타입 import

export default function Comments({ bookId }: { bookId: string }) {
  const [comments, setComments] = useState<(Comment & { likes: number })[]>([]) // 댓글 + 좋아요 필드
  const [sortBy, setSortBy] = useState<"likes" | "date">("likes")
  const [expandedComments, setExpandedComments] = useState<number[]>([])
  /** ✅ 랜덤 프로필 이미지 생성 함수 */
  const getRandomImage = () => {
    const imageNumber = Math.floor(Math.random() * 9) + 1; // 1~9 숫자 랜덤 선택
    return `/corgis/placeholder${imageNumber}.jpg`; // public 폴더 내 이미지 경로
  };
  // 목데이터 설정
  const mockComments: (Comment & { likes: number })[] = [
    { id: 1, content: "목데이터 댓글 1", userId : "userId", userNickname: "박싸피", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), parentId: null, likes: 5 },
    { id: 2, content: "목데이터 댓글 2", userId : "userId", userNickname: "김싸피", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), parentId: null, likes: 3 },
    { id: 3, content: "목데이터 대댓글 1", userId : "userId", userNickname: "이싸피", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), parentId: 1, likes: 2 },
  ]

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const userId = localStorage.getItem("userId") || ""
        const book: BookFull = await getBookById(Number(bookId), userId)

        // 각 댓글에 랜덤 좋아요 수 추가 (0~20)
        const commentsWithLikes = book.comments.map(comment => ({
          ...comment,
          likes: Math.floor(Math.random() * 20),
        }))

        setComments(commentsWithLikes)
      } catch (error) {
        console.error("댓글 데이터를 불러오는 중 오류 발생, 목데이터로 대체:", error)
        setComments(mockComments) // 요청 실패 시 목데이터로 대체
      }
    }

    fetchComments()
  }, [bookId])

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
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })
  }, [comments, sortBy])

  const renderComment = (comment: Comment & { likes: number }, isReply = false) => (
    <Card key={comment.id} className={`mb-4 ${isReply ? "ml-12" : ""} border border-border bg-background`}>
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={getRandomImage()} />
          <AvatarFallback>{comment.userNickname}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{comment.userNickname}</span>
              {!isReply && sortBy === "likes" && <Badge variant="secondary">BEST</Badge>}
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
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
              답글 {comments.filter((reply) => reply.parentId === comment.id).length}
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

  const rootComments = sortedComments.filter(comment => comment.parentId === null)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">전체 {comments.length}개</span>
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
        {rootComments.map((comment) => (
          <div key={comment.id}>
            {renderComment(comment)}
            {expandedComments.includes(comment.id) &&
              comments
                .filter((reply) => reply.parentId === comment.id)
                .map((reply) => renderComment(reply, true))}
            <Separator className="my-6" />
          </div>
        ))}
      </div>
    </div>
  )
}
