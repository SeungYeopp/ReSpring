"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, Heart, ChevronDown, Edit } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useAuthWithUser } from "@/lib/hooks/tempUseAuthWithUser";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { todayAPI } from "@/app/today/api/todayDetail";
import type { Post } from "@/app/today/api/todayDetail";
import { CommentSection } from "./comment-section";
import { ImageGallery } from "./image-gallery";
import { Trash2 } from "lucide-react";

// 게시글 데이터를 가져오는 비동기 함수
async function getPost(id: number): Promise<Post> {
  try {
    return await todayAPI.getPostDetail(id);
  } catch (error) {
    notFound(); // 게시글을 찾지 못하면 404 페이지로 리다이렉트
  }
}

// 오늘의 상세 페이지 컴포넌트
export default function TodayDetailPage({ params }: { params: { id: string } }) {
  const { user, isLoggedIn } = useAuthWithUser(); // 로그인 정보 가져오기
  const router = useRouter();

  // 상태 관리
  const [post, setPost] = useState<Post | null>(null);
  const [likes, setLikes] = useState(0);
  const [likeByMe, setLikeByMe] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  // 본인 게시글 여부 확인
  const isMyPost = user?.id === post?.userId;

  // 게시글 데이터 가져오기
  useEffect(() => {
    async function fetchPost() {
      try {
        const fetchedPost = await getPost(Number(params.id));
        setPost(fetchedPost);
        setLikes(fetchedPost.likes);
        setLikeByMe(fetchedPost.likeByMe);
        const fetchedComments = await todayAPI.getComments(Number(params.id));
        setCommentCount(fetchedComments.length);
      } catch (error) {
        notFound();
      }
    }
    fetchPost();
  }, [params.id]);

  // 좋아요 버튼 클릭 핸들러
  const handleLike = useCallback(async () => {
    if (!post) return;
    if (!isLoggedIn) {
      alert("좋아요를 누르려면 로그인이 필요합니다.");
      return;
    }
    try {
      const result = await todayAPI.likePost(post.id, "test-user-id");
      if (result === "Liked") {
        setLikes((prev) => prev + 1);
        setLikeByMe(true);
      } else {
        setLikes((prev) => prev - 1);
        setLikeByMe(false);
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류 발생:", error);
    }
  }, [post, isLoggedIn]);

  // 게시글 데이터가 없으면 아무것도 렌더링하지 않음
  if (!post) return null;

  // 게시 시간을 "~전" 형식으로 변환
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    locale: ko,
    addSuffix: true,
  });

  // 긴 내용을 일정 길이로 자르는 함수
  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  };


  // 게시글 삭제 핸들러
  const handleDelete = async () => {
    if (!post || !user?.id) return;
  // 삭제 팝업
    const confirmDelete = window.confirm("정말 이 게시글을 삭제하시겠습니까?");
    if (!confirmDelete) return;
  
    try {
      await todayAPI.deletePost(post.id, user.id);
      alert("게시글이 삭제되었습니다.");
      router.push("/today");
    } catch (error) {
      console.error("게시글 삭제 중 오류 발생:", error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };
  


  return (
    <div className="min-h-screen bg-gray-100">
      <main className="md:pt-0">
        {/* 게시글 내용 */}
        <div className="bg-white p-4 mb-2">
          {/* 작성자 정보 및 뒤로가기 버튼 */}
          <div className="flex items-start gap-3 mb-4">
            <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 flex-shrink-0" onClick={() => window.history.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2 flex-1">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/corgis/placeholder1.jpg" />
                <AvatarFallback>{post.userName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-base font-semibold">{post.userName}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">{timeAgo}</span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">정보 공유</span>
                </div>
              </div>
            </div>
          </div>

          {/* 게시글 제목 */}
          <h1 className="text-lg font-bold mt-3 mb-2">{post.title}</h1>

          {/* 게시글 내용 */}
          <div className="relative">
            <p className={`text-sm text-gray-800 whitespace-pre-wrap leading-relaxed ${!isContentExpanded && "max-h-24 overflow-hidden"}`}>
              {isContentExpanded ? post.content : truncateContent(post.content, 100)}
            </p>
          </div>

          {/* 더보기/접기 버튼 */}
          {post.content.length > 100 && (
            <Button variant="ghost" size="sm" className="mt-2 text-blue-500 hover:text-blue-700" onClick={() => setIsContentExpanded(!isContentExpanded)}>
              {isContentExpanded ? "접기" : "더 보기"}
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isContentExpanded ? "rotate-180" : ""}`} />
            </Button>
          )}

          {/* 이미지 갤러리 */}
          {post.images.length > 0 && <ImageGallery images={post.images} />}

          {/* 좋아요 및 댓글 수 표시, 본인일 시 수정하기 및 삭제하기(이건 미구현) 버튼 */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-4 text-gray-600">
              <button className={`flex items-center gap-1 text-sm ${isLoggedIn ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`} onClick={handleLike}>
                <Heart className={`w-4 h-4 ${likeByMe ? "fill-red-500 text-red-500" : ""}`} />
                <span>{likes}</span>
              </button>
              <button className="flex items-center gap-1 text-sm">
                <MessageSquare className="w-4 h-4" />
                <span>{commentCount}</span>
              </button>
            </div>
            {isMyPost && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push(`/today/${post.id}/edit`)}>
                  <Edit className="w-4 h-4 mr-1" />
                  수정하기
                </Button>
                <Button variant="outline"size="sm" onClick={handleDelete} className="text-red-500 hover:text-black border-red-500 hover:bg-red-500" >
                  <Trash2 className="w-4 h-4 mr-1 hover:stroke-black" />
                  삭제하기
                </Button>

              </div>
            )}
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white p-4">
          <CommentSection postId={post.id} isLoggedIn={isLoggedIn} />
        </div>
      </main>
    </div>
  );
}
