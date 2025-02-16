"use client"

import React from "react"

import { useEffect, useState, useCallback } from "react"
import { formatDistanceToNowStrict } from "date-fns"
import { ko } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Loader2, Send } from "lucide-react"
import { createNewBookComment, deleteBookComment, getCommentsByBookId, type UserInfo, type Comment } from "@/lib/api"
import { getUserInfo } from "@/lib/api"

export default function Comments({ bookId }: { bookId: number }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  const fetchUserInfo = useCallback(async () => {
    try {
      const info = await getUserInfo()
      setUserInfo(info)
    } catch (error) {
      console.error("사용자 정보를 불러오는 중 오류 발생:", error)
    }
  }, [])

  const fetchComments = useCallback(async () => {
    setIsLoading(true)
    try {
      const fetchedComments = await getCommentsByBookId(bookId)
      setComments(fetchedComments)
    } catch (error) {
      console.error("댓글을 불러오는 중 오류 발생:", error)
    } finally {
      setIsLoading(false)
    }
  }, [bookId])

  useEffect(() => {
    fetchComments()
    fetchUserInfo()
  }, [fetchComments, fetchUserInfo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isLoading) return

    setIsLoading(true)
    try {
      const comment = await createNewBookComment(bookId, newComment)
      setComments((prevComments) => [
        { ...comment, profileImg: userInfo?.profileImageUrl, userNickname: userInfo?.userNickname ?? "" },
        ...prevComments,
      ])
      setNewComment("")
    } catch (error) {
      console.error("댓글 작성에 실패했습니다:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    try {
      const success = await deleteBookComment(commentId)
      if (success) {
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId))
      }
    } catch (error) {
      console.error("댓글 삭제 중 오류 발생:", error)
    }
  }

  const CommentItem = React.memo(({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div
      className={`flex gap-3 ${isReply ? 'ml-8 before:content-[""] before:border-l-2 before:border-gray-200 before:-ml-4 before:mr-4' : ""}`}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={comment.profileImg} alt={comment.userNickname} />
        <AvatarFallback>{comment.userNickname[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-semibold">{comment.userNickname}</span>
          <time className="text-xs text-gray-500">
            {formatDistanceToNowStrict(new Date(comment.createdAt), {
              locale: ko,
              addSuffix: true,
            })}
          </time>
        </div>
        <p className="text-sm text-gray-800 mt-0.5">{comment.content}</p>
        <div className="flex gap-2 mt-1 text-xs text-gray-500">
          <button className="hover:text-gray-700">좋아요</button>
          {!isReply && <button className="hover:text-gray-700">답글달기</button>}
          <button onClick={() => handleDeleteComment(comment.id)} className="hover:text-gray-700">
            삭제
          </button>
        </div>
      </div>
    </div>
  ))

  return (
    <div className="space-y-6 p-4 bg-gradient-to-b from-background to-background/80">
      <div className="text-sm text-gray-600 font-medium mb-4">총 {comments.length}개의 댓글</div>

      <AnimatePresence>
        {isLoading && comments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center h-20"
          >
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={userInfo?.profileImageUrl} alt={userInfo?.userNickname} />
          <AvatarFallback>{userInfo?.userNickname?.[0]}</AvatarFallback>
        </Avatar>
        <input
          type="text"
          placeholder="따뜻한 댓글을 입력해주세요 :)"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button type="submit" disabled={isLoading || !newComment.trim()} className="rounded-full" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

