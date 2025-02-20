"use client";

import { useState, useEffect, useCallback } from "react";
import { useViewerSettings } from "../context/ViewerSettingsContext";
import { usePanelContext } from "../context/usePanelContext";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  createNewBookComment,
  deleteBookComment,
  getCommentsByBookId,
  checkIfUserLikedComment,
  likeComment,
  type Comment,
} from "@/lib/api";

interface CommentWithReplies extends Comment {
  replies?: CommentWithReplies[];
  isDeleted?: boolean;
}

export function CommentsPanel() {
  const { theme } = useViewerSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<{
    id: number;
    userNickname: string;
  } | null>(null);
  const { currentOpenPanel, openPanel, closePanel } = usePanelContext();
  const maxCharacterLimit = 100;

  // 현재 URL에서 bookId 추출
  const pathname = usePathname();
  const bookId = Number(pathname.split("/").pop());

  // 댓글 목록 불러오기
  const fetchComments = useCallback(async () => {
    if (!bookId) {
      console.error("❌ bookId가 존재하지 않습니다!");
      return;
    }
    setIsLoading(true);
    try {
      const fetchedComments = await getCommentsByBookId(bookId);
      const structuredComments = buildCommentHierarchy(fetchedComments);
      setComments(structuredComments);
    } catch (error) {
      console.error("❌ 댓글 불러오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [bookId]);

  // 댓글을 부모-자식 구조로 변환
  const buildCommentHierarchy = (comments: Comment[]): CommentWithReplies[] => {
    const commentMap = new Map<number, CommentWithReplies>();

    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    const structuredComments: CommentWithReplies[] = [];

    comments.forEach((comment) => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) parent.replies!.push(commentMap.get(comment.id)!);
      } else {
        structuredComments.push(commentMap.get(comment.id)!);
      }
    });

    return structuredComments;
  };

  // 패널이 열릴 때 댓글 불러오기
  useEffect(() => {
    if (isOpen && bookId) {
      fetchComments();
    }
  }, [isOpen, bookId, fetchComments]);

  // 패널 상태 관리
  useEffect(() => {
    if (isOpen && currentOpenPanel !== "comments") {
      setIsOpen(false);
    }
  }, [currentOpenPanel, isOpen]);

  // 패널 토글 함수
  const togglePanel = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      newState ? openPanel("comments") : closePanel();
      return newState;
    });
  };

  // 댓글 작성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isLoading || !bookId) return;
    setIsLoading(true);
    try {
      const newCommentData = replyTo
        ? await createNewBookComment(bookId, newComment, replyTo.id)
        : await createNewBookComment(bookId, newComment);

      fetchComments(); // 최신 댓글 불러오기
      setNewComment("");
      setReplyTo(null);
    } catch (error) {
      console.error("❌ 댓글 작성 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    try {
      const success = await deleteBookComment(commentId);
      if (success) fetchComments(); // 삭제 후 댓글 다시 불러오기
    } catch (error) {
      console.error("❌ 댓글 삭제 실패:", error);
    }
  };

  // 댓글 좋아요 토글
  const handleLike = async (commentId: number) => {
    try {
      const liked = await likeComment(commentId);
      setComments((prevComments) =>
        prevComments.map((comment) => ({
          ...comment,
          likeCount:
            comment.id === commentId
              ? liked
                ? (comment.likeCount ?? 0) + 1
                : (comment.likeCount ?? 0) - 1
              : comment.likeCount,
          replies: comment.replies
            ? comment.replies.map((reply) =>
                reply.id === commentId
                  ? {
                      ...reply,
                      likeCount: liked
                        ? (reply.likeCount ?? 0) + 1
                        : (reply.likeCount ?? 0) - 1,
                    }
                  : reply
              )
            : [],
        }))
      );
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
    }
  };

  // 답글 작성 설정 (대댓글에는 답글 작성 X)
  const handleReplyClick = (comment: CommentWithReplies) => {
    if (comment.parentId) return; // 대댓글에는 추가 답글을 달 수 없음
    setReplyTo({ id: comment.id, userNickname: comment.userNickname });
    setNewComment(`@${comment.userNickname} `);
  };

  // 테마에 따른 CSS 클래스 적용
  const getThemeClasses = () => {
    switch (theme) {
      case "basic":
        return "bg-white text-black border-gray-400";
      case "gray":
        return "bg-gray-800 text-white border-gray-600";
      default:
        return "bg-black text-white border-gray-800";
    }
  };

  // 댓글 렌더링 함수 (대댓글은 추가 답글 불가)
  const renderComments = (commentList: CommentWithReplies[], level = 0) => {
    return commentList.map((comment) => (
      <div
        key={comment.id}
        className={`py-2 ${level === 0 ? "border-b" : "ml-6"} ${
          level > 0 ? "border-none" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={comment.profileImg} alt={comment.userNickname} />
            <AvatarFallback>{comment.userNickname[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold">{comment.userNickname}</span>
        </div>
        <p className="text-sm">{comment.content}</p>
        <div className="flex gap-2 text-xs">
          <button onClick={() => handleLike(comment.id)}>
            👍 {comment.likeCount ?? 0}
          </button>
          {!comment.parentId && (
            <button onClick={() => handleReplyClick(comment)}>💬 답글</button>
          )}
          {!comment.isDeleted && (
            <button onClick={() => handleDeleteComment(comment.id)}>
              🗑 삭제
            </button>
          )}
        </div>
        {/* 대댓글 렌더링 */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 ml-4">
            {renderComments(comment.replies, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <>
      {/* 패널을 열기 위한 버튼 */}
      <Button variant="ghost" size="icon" onClick={togglePanel}>
        <MessageSquare className="h-5 w-5" />
      </Button>

      {/* 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 transition-opacity"
          onClick={togglePanel}
        />
      )}

      {/* 댓글 패널 */}
      <div
        className={`fixed bottom-0 left-0 w-full h-[80%] transition-transform duration-300 ease-in-out border-2 rounded-t-lg overflow-hidden ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } ${getThemeClasses()}`}
      >
        <div className="h-full flex flex-col overflow-hidden">
          <h2 className="text-xl font-bold p-4">댓글</h2>

          {/* 댓글 목록 */}
          <div className={`flex-1 overflow-y-auto px-4 ${getThemeClasses()}`}>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-500 mx-auto" />
            ) : (
              renderComments(comments)
            )}
          </div>

          {/* 댓글 입력 */}
          <div className={`p-4 ${getThemeClasses()}`}>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm"
              />
              <Button
                type="submit"
                disabled={isLoading || !newComment.trim()}
                className="rounded-full"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
