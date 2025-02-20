"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"
import Link from "next/link"
import { getAllBooksByUserNickname, getLikedBooks, Book } from "@/lib/api/book" // API 함수 가져오기
import { getUserInfo } from "@/lib/api"
import { getBookById } from "@/lib/api/book";

export default function Recommendations({ bookId }: { bookId: string }) {
  const [authorBooks, setAuthorBooks] = useState<Book[]>([])
  const [followedBooks, setFollowedBooks] = useState<Book[]>([])

  /**   랜덤 프로필 이미지 생성 함수 */
  const getRandomImage = () => {
    const imageNumber = Math.floor(Math.random() * 9) + 1; // 1~9 숫자 랜덤 선택
    return `/corgis/placeholder${imageNumber}.jpg`; // public 폴더 내 이미지 경로
  };

  // 목데이터 설정
  const mockAuthorBooks: Book[] = [
    {
      id: 1,
      authorNickname: "박싸피",
      authorProfileImage: "@/placeholder_profilepic.png",
      title: "목데이터 자서전 1",
      coverImage: getRandomImage(),
      tags: ["목데이터"],
      likeCount: 10,
      viewCount: 50,
      likedUsers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      liked: false,
    },
    {
      id: 2,
      authorNickname: "박싸피",
      authorProfileImage: "@/placeholder_profilepic.png",
      title: "목데이터 자서전 2",
      coverImage: getRandomImage(),
      tags: ["목데이터"],
      likeCount: 15,
      viewCount: 30,
      likedUsers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      liked: false,
    },
    {
      id: 3,
      authorNickname: "박싸피",
      authorProfileImage: "@/placeholder_profilepic.png",
      title: "목데이터 자서전 3",
      coverImage: getRandomImage(),
      tags: ["목데이터"],
      likeCount: 15,
      viewCount: 30,
      likedUsers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      liked: false,
    },
    {
      id: 4,
      authorNickname: "박싸피",
      authorProfileImage: "@/placeholder_profilepic.png",
      title: "목데이터 자서전 4",
      coverImage: getRandomImage(),
      tags: ["목데이터"],
      likeCount: 15,
      viewCount: 30,
      likedUsers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      liked: false,
    },
  ]

  const mockFollowedBooks: Book[] = [
    {
      id: 5,
      authorNickname: "김민철",
      authorProfileImage: "@/placeholder_profilepic.png",
      title: "구독 작가 자서전 1",
      coverImage: getRandomImage(),
      tags: ["테스트"],
      likeCount: 20,
      viewCount: 70,
      likedUsers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      liked: true,
    },
    {
      id: 6,
      authorNickname: "김민철",
      authorProfileImage: "@/placeholder_profilepic.png",
      title: "구독 작가 자서전 2",
      coverImage: getRandomImage(),
      tags: ["테스트"],
      likeCount: 5,
      viewCount: 25,
      likedUsers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      liked: true,
    },
    {
      id: 7,
      authorNickname: "김민철",
      authorProfileImage: "@/placeholder_profilepic.png",
      title: "구독 작가 자서전 3",
      coverImage: getRandomImage(),
      tags: ["테스트"],
      likeCount: 5,
      viewCount: 25,
      likedUsers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      liked: true,
    },
    {
      id: 8,
      authorNickname: "김민철",
      authorProfileImage: "@/placeholder_profilepic.png",
      title: "구독 작가 자서전 4",
      coverImage: getRandomImage(),
      tags: ["테스트"],
      likeCount: 5,
      viewCount: 25,
      likedUsers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      liked: true,
    },
  ]

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const myInfo = await getUserInfo();
        const currentBook = await getBookById(parseInt(bookId, 10))

        if (currentBook) {
          
          // 저자의 다른 자서전 가져오기
          const authorNickname = currentBook.authorNickname
          const authorBooksData = await getAllBooksByUserNickname(authorNickname)

          setAuthorBooks(authorBooksData.filter(book => book.id !== Number(bookId)))

          // 구독 중인 작가의 자서전 가져오기
          const followedBooksData = await getLikedBooks()
          setFollowedBooks(followedBooksData)
        }
      } catch (error) {
        console.error("추천 데이터를 불러오는 중 오류 발생, 목데이터로 대체:", error)
        setAuthorBooks(mockAuthorBooks) // 저자 자서전 목데이터로 대체
        setFollowedBooks(mockFollowedBooks) // 구독 작가 자서전 목데이터로 대체
      }
    }

    fetchRecommendations()
  }, [bookId])

  return (
    <div className="space-y-8">
      {/* 저자의 다른 이야기 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold px-4">저자의 다른 이야기</h3>
        <div className="overflow-x-auto">
          {followedBooks.length > 0 ? (
            <div className="flex px-4 pb-4">
              {authorBooks.map((book) => (
                <Card
                  key={book.id}
                  className="border-0 bg-transparent flex-shrink-0 shadow-none"
                  style={{
                    width: "calc((100vw - 32px) / 3)",
                    maxWidth: "200px",
                    minWidth: "120px",
                    marginRight: "12px",
                  }}
                >
                  <CardContent className="p-0 space-y-2">
                    <AspectRatio ratio={156 / 234}>
                      <Link href={`/yesterday/book/${book.id}`}>
                        <Image
                          src={book.coverImage || getRandomImage()}
                          alt={book.title}
                          fill
                          className="object-cover w-full h-full rounded-lg"
                        />
                      </Link>
                    </AspectRatio>
                    <div className="space-y-1 px-1">
                      <h4 className="font-medium text-sm leading-tight line-clamp-2"><strong>{book.title}</strong></h4>
                      <p className="text-xs text-muted-foreground">저자: {book.authorNickname}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            ) : (
              <p className="text-sm text-muted-foreground px-4">💡 저자가 쓴 다른 봄날의 서가 없습니다.</p>
          )}
        </div>
      </div>

      {/* 구독 중인 작가의 자서전 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold px-4">내가 좋아요한 봄날의 서</h3>
        <div className="overflow-x-auto">
          {followedBooks.length > 0 ? (
            <div className="flex px-4 pb-4">
              {followedBooks.map((book) => (
                <Card
                  key={book.id}
                  className="border-0 bg-transparent flex-shrink-0 shadow-none"
                  style={{
                    width: "calc((100vw - 32px) / 3)",
                    maxWidth: "200px",
                    minWidth: "120px",
                    marginRight: "12px",
                  }}
                >
                  <CardContent className="p-0 space-y-2">
                    <AspectRatio ratio={136 / 200}>
                      <Link href={`/yesterday/book/${book.id}`}>
                        <Image
                          src={book.coverImage || getRandomImage()}
                          alt={book.title}
                          fill
                          className="object-cover w-full h-full rounded-lg"
                        />
                      </Link>
                    </AspectRatio>
                    
                    <div className="space-y-1 px-1">
                      <h4 className="font-medium text-sm leading-tight line-clamp-2"><strong>{book.title}</strong></h4>
                      <p className="text-xs text-muted-foreground">저자: {book.authorNickname}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            ) : (
              <p className="text-sm text-muted-foreground px-4">💡 좋아요한 봄날의 서가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  )
}
