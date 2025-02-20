"use client"

import Image from "next/image"
import { ChevronLeft, Home, Heart, MoreVertical, Pencil, Trash, User, EyeIcon } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { getBookById, BookFull } from "@/lib/api/book" // API 호출 및 타입 import
import { TopSectionSkeleton } from "./Skeletons/TopSectionSkeleton"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { deleteBook, getUserInfo, likeOrUnlikeBook } from "@/lib/api"

  /**   랜덤 프로필 이미지 생성 함수 */
  const getRandomImage = () => {
    const imageNumber = Math.floor(Math.random() * 9) + 1; // 1~9 숫자 랜덤 선택
    return `/corgis/placeholder${imageNumber}.jpg`; // public 폴더 내 이미지 경로
  };

// 목데이터 설정
const mockBookData: BookFull = {
  id: 0,
  authorNickname: "저자ID",
  authorProfileImage: "@/placeholder_profilepic.png",
  title: "목데이터 자서전 제목",
  content: { "1장": "이것은 목데이터 자서전 내용입니다." },
  coverImage: getRandomImage(),
  tags: ["목데이터", "테스트"],
  likeCount: 0,
  viewCount: 0,
  likedUsers: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  imageUrls: [getRandomImage(),],
  comments: [],
  liked: false,
}

export default function TopSection({ book }: { book: BookFull }) {
  //const [book, setBook] = useState<BookFull | null>(null) // API 데이터 저장
  const [isLiked, setIsLiked] = useState(false)
  const [isImageExpanded, setIsImageExpanded] = useState(false)
  const [isHeartAnimating, setIsHeartAnimating] = useState(false)
  const [isMyBook, setIsMyBook] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  const router = useRouter();

  //const userId = "beb9ebc2-9d32-4039-8679-5d44393b7252"; // 박싸피의 테스트 ID

  useEffect(() => {
    const fetchBook = async () => {
      try {
        // const bookData = await getBookById(Number(bookId)); // API 호출
        // setBook(bookData);
        setIsLiked(book.liked);
        setLikeCount(book.likeCount);

        const myInfo = await getUserInfo();
        if (myInfo.userNickname === book.authorNickname) setIsMyBook(true);
      } catch (error) {
        console.error("책 데이터를 불러오는 중 오류 발생", error);
        //setBook(mockBookData);
      }
    };

    fetchBook();
  }, [book]);


  const handleImageClick = () => {
    setIsImageExpanded(true)
    setTimeout(() => {
      window.location.href = `/viewer/${book.id}`
    }, 500)
  }

  useEffect(() => {
    if (!isLiked) {
      const interval = setInterval(() => {
        setIsHeartAnimating(true)
        setTimeout(() => setIsHeartAnimating(false), 1000)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isLiked])

  if (!book) return <TopSectionSkeleton /> // 데이터 로딩 중 스켈레톤 표시

  const handleChevronLeft = () => {
    router.replace('/yesterday');
  }

  const handleBookDelete = async () => {
    try{
      const result = await deleteBook(book.id);

      router.replace('/yesterday');
    }catch(error : any){
      alert('책 삭제에 실패했습니다.')
    }
  }

  const handleClickLike = async () => {
    try {
      const result = await likeOrUnlikeBook(book.id);
  
      if (result === 'Liked') {
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      } else if (result === 'Unliked') {
        setIsLiked(false);
        setLikeCount((prev) => (prev > 0 ? prev - 1 : 0)); // 0 밑으로 내려가지 않도록
      } else {
        console.error("Unexpected response:", result);
        // 좋아요 수 변경 안 함
      }
    } catch (error) {
      alert("책 좋아요에 실패했습니다.");
    }
  };
  

  return (
    <section className="relative min-h-[80vh] text-white">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black">
        <Image
          src={book.coverImage || getRandomImage()}
          alt="cover image"
          layout="fill"
          objectFit="cover"
          className="opacity-30 blur-md"
        />
      </div>

      {/* 상단 네비게이션 */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="text-white hover:text-white/80 cursor-pointer" onClick={handleChevronLeft}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" asChild className="text-white hover:text-white/80">
            <Link href="/">
              <Home className="!w-6 !h-6" />
            </Link>
          </Button>
        </div>
        {isMyBook && (
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
              <MoreVertical className="!w-6 !h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer">
              <Pencil className="mr-2 h-4 w-4" />
              <span>편집하기</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Trash className="mr-2 h-4 w-4" />
              <span onClick={handleBookDelete}>삭제하기</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        )}
      </div>

      {/* 컨텐츠 */}
      <div className="relative z-10 flex flex-col items-center px-4 pt-10">
        <Card
          onClick={handleImageClick}
          className={cn(
            "cursor-pointer transition-all duration-500 ease-in-out w-[240px]",
            isImageExpanded ? "fixed inset-0 z-50 bg-black w-full h-full flex items-center justify-center" : "relative",
          )}
        >
          <CardContent className="p-0">
            <AspectRatio ratio={156 / 234}>
              <Image
                src={book.coverImage || getRandomImage()}
                alt={book.title}
                fill
                className={cn(
                  "rounded-lg object-cover transition-all duration-500 ease-in-out",
                  isImageExpanded ? "object-contain" : "object-cover",
                )}
              />
            </AspectRatio>
          </CardContent>
        </Card>

        <h1 className="text-2xl font-bold text-center mb-4 mt-6">{book.title}</h1>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {book.tags && book.tags.length > 0 && book.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href={`/profile/${book.authorNickname}`} className="flex items-center gap-1 text-white hover:underline">
            <Avatar className="h-6 w-6 flex-shrink-0">
              <AvatarImage src={book.authorProfileImage} alt={book.authorNickname} />
              <AvatarFallback>{book.authorNickname}</AvatarFallback>
            </Avatar>
            <span>{book.authorNickname}</span> {/* 나중에 닉네임으로 수정 가능 */}
          </Link>
          <div className="flex items-center gap-1">
            <EyeIcon className="w-5 h-5" />
            <span>{book.viewCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn("p-0 text-white hover:text-white/80", isHeartAnimating && !isLiked && "animate-bounce")}
              onClick={handleClickLike}
            >
              <Heart className={cn("w-5 h-5", isLiked && "fill-red-500 text-red-500")} />
            </Button>
            <span>{likeCount}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
