"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { ko } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import {
  createNewBookComment,
  deleteBookComment,
  getCommentsByBookId,
  checkIfUserLikedComment,
  likeComment,
  type UserInfo,
  type Comment,
} from "@/lib/api";
import { getUserInfo } from "@/lib/api";

// CommentWithReplies: Comment를 확장하여 replies와 isDeleted 속성을 추가합니다.
interface CommentWithReplies extends Comment {
  replies?: Comment[];
  isDeleted?: boolean;
}

export default function Comments({ bookId }: { bookId: number }) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  // 답글달기로 선택된 부모 댓글 정보
  const [replyTo, setReplyTo] = useState<{
    id: number;
    userNickname: string;
  } | null>(null);
  const [commentCount, setCommentCount] = useState(0);
  const maxCharacterLimit = 100;

  const fetchUserInfo = useCallback(async () => {
    try {
      const info = await getUserInfo();
      setUserInfo(info);
    } catch (error) {
      console.error("사용자 정보를 불러오는 중 오류 발생:", error);
    }
  }, []);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedComments = await getCommentsByBookId(bookId);
      setComments(fetchedComments);
    } catch (error) {
      console.error("댓글을 불러오는 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    fetchComments();
    fetchUserInfo();
  }, [fetchComments, fetchUserInfo]);

  // 댓글 총 개수 업데이트 (부모와 자식 댓글 모두 포함)
  useEffect(() => {
    const totalCount = comments.reduce((count, comment) => count + 1, 0);
    setCommentCount(totalCount);
  }, [comments]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxCharacterLimit) {
      setNewComment(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isLoading) return;
    setIsLoading(true);
    try {
      let newCommentData;
      if (replyTo) {
        // 답글 작성: 부모 댓글의 id를 세 번째 인자로 전달
        newCommentData = await createNewBookComment(
          bookId,
          newComment,
          replyTo.id
        );
      } else {
        // 부모 댓글 작성
        newCommentData = await createNewBookComment(bookId, newComment);
      }
      // 새 댓글은 배열의 맨 아래에 추가
      setComments((prev) => [
        ...prev,
        {
          ...newCommentData,
          profileImg: userInfo?.profileImageUrl,
          userNickname: userInfo?.userNickname || "",
        },
      ]);
      setNewComment("");
      setReplyTo(null);
    } catch (error) {
      console.error("댓글 작성에 실패했습니다:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 댓글 삭제 시 해당 댓글을 "삭제된 댓글입니다"로 업데이트하고, isDeleted 플래그를 true로 설정
  const handleDeleteComment = async (commentId: number) => {
    try {
      const success = await deleteBookComment(commentId);
      if (success) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, content: "삭제된 댓글입니다", isDeleted: true }
              : c
          )
        );
      }
    } catch (error) {
      console.error("댓글 삭제 중 오류 발생:", error);
    }
  };

  const handleOnClickProfile = (userNickname: string) => {
    router.push(`/profile/${userNickname}`);
  };

  const handleReplyClick = (comment: Comment) => {
    setReplyTo({ id: comment.id, userNickname: comment.userNickname });
    setNewComment(`@${comment.userNickname} `);
  };

  // 개별 댓글 렌더링 컴포넌트
  const CommentItem = React.memo(
    ({
      comment,
      isReply = false,
    }: {
      comment: CommentWithReplies;
      isReply?: boolean;
    }) => {
      // 좋아요 상태 관리
      const [isLiked, setIsLiked] = useState(false);
      const [likeCount, setLikeCount] = useState(comment.likeCount || 0);

      useEffect(() => {
        async function checkLike() {
          const liked = await checkIfUserLikedComment(comment.id);
          setIsLiked(liked);
        }
        checkLike();
      }, [comment.id]);

      const handleLike = useCallback(async () => {
        try {
          const liked = await likeComment(comment.id);
          setIsLiked(liked);
          setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
        } catch (error) {
          console.error("좋아요 토글 실패:", error);
        }
      }, [comment.id]);

      return (
        <div
          className={`flex gap-3 ${
            isReply
              ? 'ml-8 before:content-[""] before:border-l-2 before:border-gray-200 before:-ml-4 before:mr-4'
              : ""
          }`}
        >
          <Avatar
            className="h-8 w-8 flex-shrink-0 cursor-pointer"
            onClick={() => handleOnClickProfile(comment.userNickname)}
          >
            <AvatarImage src={comment.profileImg} alt={comment.userNickname} />
            <AvatarFallback>{comment.userNickname[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-baseline gap-1">
              <span
                className="text-sm font-semibold cursor-pointer hover:underline"
                onClick={() => handleOnClickProfile(comment.userNickname)}
              >
                {comment.userNickname}
              </span>
              <time className="text-xs text-gray-500">
                {formatDistanceToNowStrict(new Date(comment.createdAt), {
                  locale: ko,
                  addSuffix: true,
                })}
              </time>
            </div>
            <p className="text-sm text-gray-800 mt-0.5">{comment.content}</p>
            <div className="flex gap-2 mt-1 text-xs text-gray-500">
              <button
                onClick={handleLike}
                className={`hover:text-gray-700 ${
                  isLiked ? "text-blue-500" : ""
                }`}
              >
                좋아요 {likeCount > 0 && `(${likeCount})`}
              </button>
              {!isReply && (
                <button
                  onClick={() => handleReplyClick(comment)}
                  className="hover:text-gray-700"
                >
                  답글달기
                </button>
              )}
              {/* 삭제 버튼은 삭제된 댓글일 경우 보이지 않음 */}
              {!comment.isDeleted && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="hover:text-gray-700"
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }
  );

  // 그룹화: 부모 댓글과 해당 답글을 묶어서 반환
  const groupedComments = useMemo(() => {
    const parentComments = comments.filter((c) => !c.parentId);
    return parentComments.map((parent) => ({
      ...parent,
      replies: comments.filter((c) => c.parentId === parent.id),
    }));
  }, [comments]);

  const memoizedComments = useMemo(() => {
    return groupedComments.map((parent) => (
      <div key={parent.id} className="space-y-4">
        <CommentItem comment={parent} />
        {parent.replies && parent.replies.length > 0 && (
          <div className="space-y-4">
            {parent.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    ));
  }, [groupedComments]);

  const isLimitReached = newComment.length === maxCharacterLimit;

  return (
    <div className="relative">
      <div className="text-sm text-gray-600 font-medium mb-4">
        총 {commentCount}개의 댓글
      </div>
      <div className="space-y-6">
        {memoizedComments}
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        )}
      </div>
      <div className="fixed bottom-16 left-0 w-full p-4 bg-white border-t md:static md:border-none md:bg-transparent">
        {replyTo && (
          <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md mb-2">
            <span className="text-sm text-gray-600">
              <span className="font-semibold">{replyTo.userNickname}</span>{" "}
              님에게 답글 작성 중
            </span>
            <button
              type="button"
              onClick={() => {
                setReplyTo(null);
                setNewComment("");
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              취소
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage
              src={userInfo?.profileImageUrl}
              alt={userInfo?.userNickname}
            />
            <AvatarFallback>{userInfo?.userNickname?.[0]}</AvatarFallback>
          </Avatar>
          <input
            type="text"
            placeholder="따뜻한 댓글을 입력해주세요 :)"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            type="submit"
            disabled={isLoading || !newComment.trim()}
            className="rounded-full"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
