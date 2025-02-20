"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useViewerSettings } from "../context/ViewerSettingsContext";
import { usePanelContext } from "../context/usePanelContext";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustomSelect, CustomSelectTrigger, CustomSelectContent, CustomSelectItem, CustomSelectValue } from "../../../yesterday/book/components/custom-select"; // shadCN or custom
import { Heart, Loader2, MessageSquare, Send, Trash2, X } from "lucide-react";
import { createNewBookComment, deleteBookComment, getCommentsByBookId, checkIfUserLikedComment, likeComment, getUserInfo, type UserInfo, type Comment } from "@/lib/api";

/**
 * 대댓글까지 포함할 수 있도록 정의
 */
interface CommentWithReplies extends Comment {
  replies?: CommentWithReplies[];
  isDeleted?: boolean;
}

/**
 * CommentsPanel
 * - 두 번째 코드의 댓글 정렬, BEST, 대댓글 그룹핑 로직
 * - 첫 번째 코드의 테마, 슬라이딩 패널 로직
 */
export function CommentsPanel() {
  const router = useRouter();

  // ===== (1) 테마 및 패널 열기/닫기 관련 상태 =====
  const { theme } = useViewerSettings();
  const { currentOpenPanel, openPanel, closePanel } = usePanelContext();
  const [isOpen, setIsOpen] = useState(false);

  // ===== (2) 댓글, 유저 정보 관련 상태 =====
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // ===== (3) 대댓글, 정렬, BEST 관련 상태 =====
  const [replyingTo, setReplyingTo] = useState<{
    id: number;
    userNickname: string;
  } | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<{
    [key: number]: boolean;
  }>({});
  const [sortBy, setSortBy] = useState<"popular" | "latest">("popular");
  const [commentCount, setCommentCount] = useState(0);
  const maxCharacterLimit = 100;

  // ===== (4) bookId 가져오기 (첫 번째 코드 방식을 유지) =====
  const pathname = usePathname();
  const bookId = Number(pathname.split("/").pop());

  // ===== (5) theme에 따라 CSS 클래스를 리턴 (첫 번째 코드 유지) =====
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

  // ===== (6) 데이터 가져오기(댓글, 사용자 정보) =====
  const fetchUserInfo = useCallback(async () => {
    try {
      const info = await getUserInfo();
      setUserInfo(info);
    } catch (error) {
      console.error("❌ 사용자 정보를 불러오는 중 오류 발생:", error);
    }
  }, []);

  /**
   * 댓글을 가져온 뒤, (두 번째 코드처럼)
   * -> parentId 없는 애들을 부모로, 같은 id를 parentId로 가지는 애들을 replies로 분류
   */
  const fetchComments = useCallback(async () => {
    if (!bookId) return;
    setIsLoading(true);
    try {
      const fetchedComments = await getCommentsByBookId(bookId);
      setComments(buildCommentHierarchy(fetchedComments));
    } catch (error) {
      console.error("❌ 댓글 불러오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [bookId]);

  /**
   * 댓글 구조를 계층적으로 만들기
   * (첫 번째 코드의 buildCommentHierarchy 로직 재사용)
   */
  const buildCommentHierarchy = (rawComments: Comment[]): CommentWithReplies[] => {
    const commentMap = new Map<number, CommentWithReplies>();

    // 미리 댓글들을 Map에 저장
    rawComments.forEach((c) => {
      commentMap.set(c.id, { ...c, replies: [] });
    });

    // parentId 기준으로 분류
    const structured: CommentWithReplies[] = [];

    rawComments.forEach((c) => {
      if (c.parentId) {
        const parent = commentMap.get(c.parentId);
        if (parent) {
          parent.replies?.push(commentMap.get(c.id)!);
        }
      } else {
        structured.push(commentMap.get(c.id)!);
      }
    });

    return structured;
  };

  // ===== (7) 화면 로드시 유저, 댓글 정보 불러오기 =====
  useEffect(() => {
    if (isOpen && bookId) {
      fetchComments();
      fetchUserInfo();
    }
  }, [isOpen, bookId, fetchComments, fetchUserInfo]);

  // ===== (8) 전체 댓글 수 계산 =====
  useEffect(() => {
    let total = 0;
    // 대댓글 포함 전체 개수 세고 싶다면 (모든 children까지 세기)
    const countAll = (list: CommentWithReplies[]) => {
      list.forEach((c) => {
        total += 1;
        if (c.replies && c.replies.length > 0) {
          countAll(c.replies);
        }
      });
    };
    countAll(comments);
    setCommentCount(total);
  }, [comments]);

  // ===== (9) 패널이 열려있는데, 다른 패널이 열리면 닫기 =====
  useEffect(() => {
    if (isOpen && currentOpenPanel !== "comments") {
      setIsOpen(false);
    }
  }, [currentOpenPanel, isOpen]);

  // ===== (10) 패널 토글 함수 (첫 번째 코드) =====
  const togglePanel = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      if (newState) openPanel("comments");
      else closePanel();
      return newState;
    });
  };

  // ===== (11) 댓글 작성 =====
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !bookId || isLoading) return;
    setIsLoading(true);
    try {
      await createNewBookComment(bookId, newComment, replyingTo?.id);
      // 최신 상태 반영
      await fetchComments();
      setNewComment("");
      setReplyingTo(null);
    } catch (error) {
      console.error("❌ 댓글 작성 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ===== (12) 댓글 삭제 =====
  const handleDeleteComment = async (commentId: number) => {
    try {
      const success = await deleteBookComment(commentId);
      if (success) {
        // 다시 목록 불러오기
        fetchComments();
      }
    } catch (error) {
      console.error("❌ 댓글 삭제 실패:", error);
    }
  };

  // ===== (13) 답글 버튼 클릭 -> 대댓글 작성 모드로 전환 =====
  const handleReplyClick = (comment: CommentWithReplies) => {
    // 이미 대댓글에 대한 답글은 막고 싶다면:
    if (comment.parentId) return; // 대댓글에 답글 제한
    setReplyingTo({ id: comment.id, userNickname: comment.userNickname });
    setNewComment(`@${comment.userNickname} `);
    // 펼치기
    setExpandedReplies((prev) => ({ ...prev, [comment.id]: true }));
  };

  // ===== (14) 좋아요 토글 =====
  const handleLike = async (commentId: number) => {
    try {
      const liked = await likeComment(commentId);
      // 토글 결과에 따라 likeCount 업데이트
      setComments((prev) => prev.map((c) => updateLikeCount(c, commentId, liked)));
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
    }
  };

  /**
   * 재귀적으로 찾으면서 likeCount 업데이트
   */
  const updateLikeCount = (comment: CommentWithReplies, targetId: number, isLiked: boolean): CommentWithReplies => {
    if (comment.id === targetId) {
      const newLikeCount = (comment.likeCount || 0) + (isLiked ? 1 : -1);
      return { ...comment, likeCount: newLikeCount };
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: comment.replies.map((r) => updateLikeCount(r, targetId, isLiked)),
      };
    }
    return comment;
  };

  // ===== (15) 대댓글 펼치기/접기 =====
  const toggleReplies = (commentId: number) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // ===== (16) BEST 댓글 판별 (상위 3개) =====
  const isTopComment = useCallback(
    (comment: CommentWithReplies) => {
      // 부모 댓글만 대상으로 (parentId 없는)
      const parentComments = comments.filter((c) => !c.parentId);
      const sortedByLikes = [...parentComments].sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
      // 상위 3개 안에 들어가면 BEST
      return sortedByLikes.indexOf(comment) < 3;
    },
    [comments]
  );

  // ===== (17) 인기순/최신순 정렬 로직 =====
  const sortedComments = useMemo(() => {
    const flatComments = [...comments]; // 원본 복제
    // parentId가 없는 것들만 정렬 기준으로 삼고, 대댓글은 parent 밑으로 들어감
    // 여기선 일단 전체를 정렬, buildCommentHierarchy 이후라 parent/child가 구별되어 있음
    return flatComments.sort((a, b) => {
      if (sortBy === "popular") {
        return (b.likeCount || 0) - (a.likeCount || 0);
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [comments, sortBy]);

  /**
   * 부모 댓글 + 자식댓글(대댓글) grouping
   * (두 번째 코드에서 groupedComments 했던 것과 유사)
   */
  const groupedComments = useMemo(() => {
    // 정렬된 목록에서 parentId 없는 것만
    const parentComments = sortedComments.filter((c) => !c.parentId);
    // 대댓글은 이미 buildCommentHierarchy로 c.replies에 들어 있음
    return parentComments;
  }, [sortedComments]);

  // ===== (18) 댓글 입력 핸들러 =====
  const handleCommentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxCharacterLimit) {
      setNewComment(e.target.value);
    }
  };

  // ===== (19) 대댓글 모드 취소 =====
  const cancelReply = () => {
    setReplyingTo(null);
    setNewComment("");
  };

  // ===== (20) 개별 댓글 렌더링 (두 번째 코드의 CommentItem) =====
  // Memo로 감싸면 불필요한 리렌더 줄일 수 있음
  const CommentItem = React.memo(({ comment, isReply = false }: { comment: CommentWithReplies; isReply?: boolean }) => {
    // 날짜 포맷
    const date = new Date(comment.createdAt);
    const formattedDate = `${String(date.getFullYear()).slice(-2)}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;

    // 좋아요 확인 (서버에서 boolean 받아오기)
    const [isLiked, setIsLiked] = useState(false);
    const [hasCheckedLike, setHasCheckedLike] = useState(false);
    const [likeCount, setLikeCount] = useState(comment.likeCount || 0);

    // 마운트 시 서버에서 좋아요 여부 확인
    const checkLike = useCallback(async (commentId: number) => {
      try {
        const liked = await checkIfUserLikedComment(commentId);
        return liked;
      } catch (error) {
        console.error("좋아요 확인 실패:", error);
        return false;
      }
    }, []);

    useEffect(() => {
      const fetchLikeStatus = async () => {
        if (!hasCheckedLike) {
          const liked = await checkLike(comment.id);
          setIsLiked(liked);
          setHasCheckedLike(true);
        }
      };
      fetchLikeStatus();
    }, [checkLike, comment.id, hasCheckedLike]);

    const handleLikeClick = useCallback(async () => {
      try {
        const liked = await likeComment(comment.id);
        setIsLiked(liked);
        setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
      } catch (error) {
        console.error("좋아요 토글 실패:", error);
      }
    }, [comment.id]);

    // 프로필 이동
    const handleOnClickProfile = (nickname: string) => {
      router.push(`/profile/${nickname}`);
    };

    // 자식 댓글이 있다면(대댓글)
    const hasReplies = comment.replies && comment.replies.length > 0;
    const replyCount = comment.replies?.length ?? 0;

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
                {/* 인기순 정렬 시, 상위 3개 부모 댓글은 BEST 배지 */}
                {!isReply && sortBy === "popular" && isTopComment(comment) && (
                  <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4 bg-red-500">
                    BEST
                  </Badge>
                )}
                <span className="text-xs text-gray-500">{formattedDate}</span>
              </div>
              {/* 내용 */}
              <p className="text-sm mt-1 break-words">{comment.content.startsWith("삭제된 댓글") ? <span className="text-gray-400">{comment.content}</span> : comment.content}</p>{" "}
              {/* 댓글 하단 버튼들 */}
              <div className="flex items-center gap-3 mt-2">
                {/* 대댓글 토글 버튼: 댓글이 삭제되었어도 자식 댓글이 있다면 항상 표시 */}
                {!isReply && hasReplies && (
                  <button onClick={() => toggleReplies(comment.id)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {replyCount > 0 && replyCount}
                  </button>
                )}

                {/* 삭제된 댓글이 아닌 경우에만 좋아요, 답글, 삭제 버튼 표시 */}
                {!comment.content.startsWith("삭제된 댓글") && (
                  <>
                    <button onClick={handleLikeClick} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current text-red-500" : ""}`} />
                      {likeCount > 0 && likeCount}
                    </button>
                    {!isReply && (
                      <button onClick={() => handleReplyClick(comment)} className="text-xs text-gray-500 hover:text-gray-700">
                        답글
                      </button>
                    )}
                    {comment.userNickname === userInfo?.userNickname && (
                      <button onClick={() => handleDeleteComment(comment.id)} className="ml-auto text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* 대댓글 */}
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

  const getInputThemeClasses = (theme: string) => {
    switch (theme) {
      case "basic":
        return "bg-gray-100 text-black"; // 밝은 테마
      case "gray":
        return "bg-gray-700 text-white"; // 어두운 테마
      default:
        return "bg-black text-white"; // 기본(더 어두운) 테마
    }
  };

  const getSelectThemeClasses = (theme: string) => {
    switch (theme) {
      case "basic":
        return "bg-white text-black border-gray-300";
      case "gray":
        return "bg-gray-700 text-white border-gray-600";
      default:
        return "bg-black text-white border-gray-800";
    }
  };
  // ===== (21) 실제 JSX 렌더링 =====
  return (
    <>
      {/* 패널 열기용 버튼 (첫 번째 코드) */}
      <Button variant="ghost" size="icon" onClick={togglePanel}>
        <MessageSquare className="h-5 w-5" />
      </Button>

      {/* 배경 오버레이 */}
      {isOpen && <div className="fixed inset-0 bg-black/40 transition-opacity" onClick={togglePanel} />}

      {/* ===== 슬라이딩 패널 ===== */}
      <div
        className={`
          fixed bottom-0 left-0 w-full h-[80%] transition-transform
          duration-300 ease-in-out border-2 rounded-t-lg overflow-hidden
          ${isOpen ? "translate-y-0" : "translate-y-full"}
          ${getThemeClasses()}
        `}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* 패널 헤더 */}
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-bold">댓글</h2>
            {/* 정렬 옵션 */}
            <div className="flex items-center space-x-4">
              <span className="text-sm">전체 {commentCount}</span>
              <CustomSelect value={sortBy} onValueChange={(value: "popular" | "latest") => setSortBy(value)}>
                <CustomSelectTrigger
                  className={`
    w-[120px] text-sm 
    ${getSelectThemeClasses(theme)}
  `}
                >
                  <CustomSelectValue placeholder="정렬 기준" />
                </CustomSelectTrigger>
                <CustomSelectContent>
                  <CustomSelectItem value="popular">인기순</CustomSelectItem>
                  <CustomSelectItem value="latest">최신순</CustomSelectItem>
                </CustomSelectContent>
              </CustomSelect>
            </div>
          </div>

          {/* 댓글 목록 */}
          <div className={`flex-1 overflow-y-auto px-4 ${getThemeClasses()}`}>
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              </div>
            ) : groupedComments.length > 0 ? (
              <div className="space-y-6">
                {groupedComments.map((parent) => (
                  <CommentItem key={parent.id} comment={parent} />
                ))}
              </div>
            ) : (
              <div className="text-center text-sm py-4">아직 댓글이 없습니다.</div>
            )}
          </div>

          {/* 댓글 입력란 */}
          <div className={`p-4 border-t ${getThemeClasses()}`}>
            {replyingTo && (
              <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md mb-2">
                <span className="text-sm text-gray-600 ${getInputThemeClasses(theme)}">
                  <span className="font-semibold">{replyingTo.userNickname}</span>
                  님에게 답글 작성 중
                </span>
                <button type="button" onClick={cancelReply} className="text-sm text-gray-500 hover:text-gray-700">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={userInfo?.profileImageUrl} alt={userInfo?.userNickname} />
                <AvatarFallback>{userInfo?.userNickname?.[0] ?? "?"}</AvatarFallback>
              </Avatar>
              <input
                type="text"
                placeholder={replyingTo ? "답글을 입력해주세요" : "따뜻한 댓글을 입력해주세요 :)"}
                value={newComment}
                onChange={handleCommentInput}
                className={`flex-1 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary 
                  ${getInputThemeClasses(theme)}`}
              />
              <Button type="submit" disabled={isLoading || !newComment.trim()} className="rounded-full" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
