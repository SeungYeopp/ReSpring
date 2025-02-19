"use client"

import React, { useEffect, useState, useCallback, useMemo } from "react"
import { formatDistanceToNowStrict } from "date-fns"
import { ko } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/hooks/tempUseAuth"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  type Comment,
  getCommentsByPostId,
  getChildrenComments,
  createNewCommunityComment,
  createNewCommunityChildComment,
  checkIfUserLikedComment,
  likeComment,
} from "@/lib/api"

interface CommentSectionProps {
  postId: number
  userId: string
}

interface CommentWithReplies extends Comment {
  replies?: Comment[]
}

// Memoize Avatar component to prevent re-rendering
const MemoizedAvatar = React.memo(({ comment }: { comment: Comment }) => (
  <Avatar className="h-7 w-7 flex-shrink-0 cursor-pointer">
    <AvatarImage src={comment.profileImg} alt={comment.userNickname} />
    <AvatarFallback>{comment.userNickname}</AvatarFallback>
  </Avatar>
))

export function CommentSection({ postId, userId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentWithReplies[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [replyTo, setReplyTo] = useState<{ id: number; username: string } | null>(null)
  const { login } = useAuth()
  const [hasMore, setHasMore] = useState(true)
  const [commentCount, setCommentCount] = useState(0) //   내부 상태 관리
  const [maxCharacterLimit] = useState(100) // Set the maximum character limit

  const router = useRouter()

  useEffect(() => {
    loadComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  //   댓글 개수가 변경될 때 내부 상태 업데이트
  useEffect(() => {
    const totalCommentCount = comments.reduce((count, comment) => {
      count++;
      if (comment.replies) {
        count += comment.replies.length;
      }
      return count;
    }, 0);
  
    setCommentCount(totalCommentCount);
  }, [comments]);

  // Handle input change
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxCharacterLimit) {
      setNewComment(e.target.value)
    }
  }

  async function loadComments() {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    try {
      const parentComments = await getCommentsByPostId(postId)
      const newParentsComments = parentComments.filter((comment) => !comment.parentId)

      const commentsWithReplies = await Promise.all(
        newParentsComments.map(async (parentComment) => {
          const replies = parentComments.filter((comment) => comment.parentId === parentComment.id)
          return {
            ...parentComment,
            replies,
          }
        }),
      )
      setComments(commentsWithReplies)
      setHasMore(commentsWithReplies.length > 0)
    } catch (error) {
      console.error("댓글을 불러오는데 실패했습니다:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim() || isLoading) return

    setIsLoading(true)
    try {
      if (replyTo) {
        await createNewCommunityChildComment(postId, newComment, replyTo.id)
      } else {
        await createNewCommunityComment(postId, newComment)
      }
      const parentComments = await getCommentsByPostId(postId)
      const newParentsComments = parentComments.filter((comment) => !comment.parentId)

      const commentsWithReplies = await Promise.all(
        newParentsComments.map(async (comment) => {
          const replies = await getChildrenComments(comment.id)
          return {
            ...comment,
            replies,
          }
        }),
      )
      setComments(commentsWithReplies)
      setHasMore(commentsWithReplies.length > 0)

      setNewComment("")
      setReplyTo(null)

      loadComments()
    } catch (error) {
      console.error("댓글 작성에 실패했습니다:", error)
    } finally {
      setIsLoading(false)
    }
  }

  //   개별 댓글 렌더링 컴포넌트
  function CommentItem({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
    const [isLiked, setIsLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(comment.likeCount || 0)

    // Check if the user has liked the comment when it is rendered
    useEffect(() => {
      async function checkLikeStatus() {
        const liked = await checkIfUserLikedComment(comment.id)
        setIsLiked(liked)
      }
      checkLikeStatus()
    }, [comment.id, userId])

    const handleLike = useCallback(async () => {
      try {
        const liked = await likeComment(comment.id)
        setIsLiked(liked)
        setLikeCount((prev) => (liked ? prev + 1 : prev - 1))
      } catch (error) {
        console.error("Failed to like/unlike comment:", error)
      }
    }, [comment.id])

    const handleOnClickProfile = () => {
      router.push(`/profile/${comment.userNickname}`)
    }

    return (
      <div
        className={`flex gap-3 ${isReply ? 'ml-8 before:content-[""] before:border-l-2 before:border-gray-200 before:-ml-4 before:mr-4' : ""}`}
      >
        <MemoizedAvatar comment={comment} />
        <div className="flex-1">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-semibold cursor-pointer" onClick={handleOnClickProfile}>{comment.userNickname}</span>
            <time className="text-xs text-gray-500">
              {formatDistanceToNowStrict(new Date(comment.createdAt), {
                locale: ko,
                addSuffix: true,
              })}
            </time>
          </div>
          <p className="text-sm text-gray-800 mt-0.5">{comment.content}</p>
          <div className="flex gap-2 mt-1 text-xs text-gray-500">
            {!isReply && (
              <button
                onClick={() => {
                  setReplyTo({ id: comment.id, username: comment.userNickname })
                  setNewComment(`@${comment.userNickname} `)
                }}
                className="hover:text-gray-700"
              >
                답글달기
              </button>
            )}
            <button
              onClick={handleLike}
              className={`hover:text-gray-700 ${isLiked ? "text-blue-500" : ""}`}
            >
              좋아요 {likeCount > 0 && `(${likeCount})`}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Memoize the list of comments to avoid unnecessary re-renders
  const memoizedComments = useMemo(() => {
    return comments.map((comment) => (
      <div key={comment.id} className="space-y-4">
        <CommentItem comment={comment} />
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    ))
  }, [comments])

  // Render the warning message when the character limit is reached
  const isLimitReached = newComment.length === maxCharacterLimit

  return (
    <div className="relative">
      {/* 댓글 개수 표시 */}
      <div className="text-sm text-gray-600 font-medium mb-4">총 {commentCount}개의 댓글</div>

      {/* 댓글 목록 */}
      <div className="space-y-6">
        {memoizedComments}

        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        )}
      </div>

      {/* 하단 입력 폼 */}
      <div className="fixed bottom-16 left-0 w-full p-4 bg-white border-t md:static md:border-none md:bg-transparent">
        {true ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            {replyTo && (
              <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                <span className="text-sm text-gray-600">
                  <span className="font-medium">{replyTo.username}</span>님에게 답글 작성 중
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setReplyTo(null)
                    setNewComment("")
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  취소
                </button>
              </div>
            )}

            {/* Display the warning if the limit is reached */}
            {isLimitReached && (
              <div className="text-sm text-red-500 mb-2">최대 {maxCharacterLimit}자까지 입력 가능합니다.</div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="따뜻한 댓글을 입력해주세요 :)"
                value={newComment}
                onChange={handleCommentChange}
                className="flex-1 bg-gray-100 rounded-full px-3 py-1.5 text-sm"
              />
              <Button
                type="submit"
                disabled={isLoading || !newComment.trim()}
                className="rounded-full text-sm h-8 px-3"
                size="sm"
              >
                {isLoading ? "작성 중..." : "작성"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-center text-gray-500">댓글을 작성하려면 로그인이 필요합니다.</p>
            <Button onClick={login} className="mt-2 w-full">
              로그인
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
