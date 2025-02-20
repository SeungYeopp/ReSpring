"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, Send, X, MessageSquare, Trash2, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CustomSelect, CustomSelectContent, CustomSelectItem, CustomSelectTrigger, CustomSelectValue } from "./custom-select";
import { createNewBookComment, deleteBookComment, getCommentsByBookId, checkIfUserLikedComment, likeComment, type UserInfo, type Comment } from "@/lib/api";
import { getUserInfo } from "@/lib/api";

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
  const [replyingTo, setReplyingTo] = useState<{ id: number; userNickname: string } | null>(null);
  const [commentCount, setCommentCount] = useState(0);
  const [expandedReplies, setExpandedReplies] = useState<{ [key: number]: boolean }>({});
  const maxCharacterLimit = 100;
  const [sortBy, setSortBy] = useState<"popular" | "latest">("popular");
  const commentInputRef = useRef<HTMLInputElement>(null);
  const replyingCommentRef = useRef<HTMLDivElement>(null);

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
      const newCommentData = await createNewBookComment(bookId, newComment, replyingTo?.id);
      setComments((prev) => [
        ...prev,
        {
          ...newCommentData,
          profileImg: userInfo?.profileImageUrl,
          userNickname: userInfo?.userNickname || "",
        },
      ]);
      setNewComment("");
      setReplyingTo(null);
      // 새 답글이 추가되면 해당 부모 댓글의 답글을 자동으로 펼칩니다.
      if (replyingTo) {
        setExpandedReplies((prev) => ({ ...prev, [replyingTo.id]: true }));
      }
    } catch (error) {
      console.error("댓글 작성에 실패했습니다:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const success = await deleteBookComment(commentId);
      if (success) {
        setComments((prev) => prev.map((c) => (c.id === commentId ? { ...c, content: "삭제된 댓글입니다", isDeleted: true } : c)));
      }
    } catch (error) {
      console.error("댓글 삭제 중 오류 발생:", error);
    }
  };

  const handleOnClickProfile = (userNickname: string) => {
    router.push(`/profile/${userNickname}`);
  };

  const handleReplyClick = (comment: Comment) => {
    setReplyingTo({ id: comment.id, userNickname: comment.userNickname });
    setNewComment(`@${comment.userNickname} `);
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
    if (replyingCommentRef.current) {
      replyingCommentRef.current.scrollIntoView({ behavior: "smooth" });
    }
    // 답글 작성 시 해당 댓글의 답글을 자동으로 펼칩니다.
    setExpandedReplies((prev) => ({ ...prev, [comment.id]: true }));
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setNewComment("");
  };

  const toggleReplies = (commentId: number) => {
    setExpandedReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const sortedComments = useMemo(() => {
    return [...comments].sort((a, b) => {
      if (sortBy === "popular") {
        return (b.likeCount || 0) - (a.likeCount || 0);
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [comments, sortBy]);

  const groupedComments = useMemo(() => {
    const parentComments = sortedComments.filter((c) => !c.parentId);
    return parentComments.map((parent) => ({
      ...parent,
      replies: sortedComments.filter((c) => c.parentId === parent.id),
    }));
  }, [sortedComments]);

  const isTopComment = useCallback(
    (comment: Comment) => {
      const parentComments = comments.filter((c) => !c.parentId);
      const sortedByLikes = parentComments.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
      return sortedByLikes.indexOf(comment) < 3;
    },
    [comments]
  );

  const CommentItem = React.memo(({ comment, isReply = false }: { comment: CommentWithReplies; isReply?: boolean }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
    const hasReplies = !isReply && comment.replies && comment.replies.length > 0;
    const replyCount = hasReplies ? comment.replies?.length || 0 : 0;

    const checkLike = useCallback(async (commentId: number) => {
      try {
        const liked = await checkIfUserLikedComment(commentId);
        return liked;
      } catch (error) {
        console.error("좋아요 확인 실패:", error);
        return false;
      }
    }, []);

    const [hasCheckedLike, setHasCheckedLike] = useState(false);

    useEffect(() => {
      const fetchLikeStatus = async () => {
        try {
          const liked = await checkLike(comment.id);
          setIsLiked(liked);
          setHasCheckedLike(true);
        } catch (error) {
          console.error("좋아요 상태 확인 실패:", error);
        }
      };

      if (!hasCheckedLike) {
        fetchLikeStatus();
      }
    }, [checkLike, comment.id, hasCheckedLike]);

    const handleLike = useCallback(async () => {
      try {
        const liked = await likeComment(comment.id);
        setIsLiked(liked);
        setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
      } catch (error) {
        console.error("좋아요 토글 실패:", error);
      }
    }, [comment.id]);

    const date = new Date(comment.createdAt);
    const formattedDate = `${date.getFullYear().toString().slice(-2)}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")}`;

    return (
      <div className="space-y-4">
        <div className={`${isReply ? "ml-8" : ""}`}>
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0 cursor-pointer" onClick={() => handleOnClickProfile(comment.userNickname)}>
              <AvatarImage src={comment.profileImg} alt={comment.userNickname} />
              <AvatarFallback>{comment.userNickname[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium cursor-pointer hover:underline" onClick={() => handleOnClickProfile(comment.userNickname)}>
                  {comment.userNickname}
                </span>
                {!isReply && sortBy === "popular" && isTopComment(comment) && (
                  <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4 bg-red-500">
                    BEST
                  </Badge>
                )}
                <span className="text-xs text-gray-500">{formattedDate}</span>
              </div>
              <p className="text-sm text-gray-900 mt-1 break-words">{comment.content}</p>
              {comment.content === "삭제된 댓글입니다." ? (
                <div className="mt-2">{/* <span className="text-xs text-gray-500">삭제된 댓글입니다.</span> */}</div>
              ) : (
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={handleLike} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current text-red-500" : ""}`} />
                    {likeCount > 0 && likeCount}
                  </button>
                  {!isReply && (
                    <button onClick={() => toggleReplies(comment.id)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {replyCount > 0 && replyCount}
                    </button>
                  )}
                  <button onClick={() => handleReplyClick(comment)} className="text-xs text-gray-500 hover:text-gray-700">
                    {/* 답글 */}
                  </button>
                  {comment.userNickname === userInfo?.userNickname && (
                    <button onClick={() => handleDeleteComment(comment.id)} className="ml-auto text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {hasReplies && expandedReplies[comment.id] && (
          <div className="space-y-4 mt-2">
            {comment.replies?.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    );
  });

  const isLimitReached = newComment.length === maxCharacterLimit;

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600 font-medium">전체 {commentCount}</div>
        <CustomSelect value={sortBy} onValueChange={(value: "popular" | "latest") => setSortBy(value)}>
          <CustomSelectTrigger className="w-[180px]">
            <CustomSelectValue placeholder="정렬 기준" />
          </CustomSelectTrigger>
          <CustomSelectContent>
            <CustomSelectItem value="popular">인기순</CustomSelectItem>
            <CustomSelectItem value="latest">최신순</CustomSelectItem>
          </CustomSelectContent>
        </CustomSelect>
      </div>
      <div className="space-y-6">
        {groupedComments.map((parent) => (
          <div key={parent.id}>
            <CommentItem comment={parent} />
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        )}
      </div>
      <div className="z-50 fixed bottom-0 left-0 w-full p-4 bg-white border-t md:static md:border-none md:bg-transparent">
        {replyingTo && (
          <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md mb-2">
            <span className="text-sm text-gray-600">
              <span className="font-semibold">{replyingTo.userNickname}</span> 님에게 답글 작성 중
            </span>
            <button type="button" onClick={cancelReply} className="text-sm text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={userInfo?.profileImageUrl} alt={userInfo?.userNickname} />
            <AvatarFallback>{userInfo?.userNickname?.[0]}</AvatarFallback>
          </Avatar>
          <input
            ref={commentInputRef}
            type="text"
            placeholder={replyingTo ? "답글을 입력해주세요" : "따뜻한 댓글을 입력해주세요 :)"}
            value={newComment}
            onChange={handleCommentChange}
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" disabled={isLoading || !newComment.trim()} className="rounded-full" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
