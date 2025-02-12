"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export default function Recommendations({ bookId }: { bookId: string }) {
  
   /** ✅ 랜덤 프로필 이미지 생성 함수 */
 const getRandomImage = () => {
  const imageNumber = Math.floor(Math.random() * 9) + 1; // 1~9 숫자 랜덤 선택
  return `/corgis/placeholder${imageNumber}.jpg`; // public 폴더 내 이미지 경로
};
  
  const authorBooks = [
    {
      id: 1,
      title: "새로운 시작",
      author: "저자 1",
      coverImage:
        getRandomImage(),
    },
    {
      id: 2,
      title: "꿈을 향한 여정",
      author: "저자 1",
      coverImage:
      getRandomImage(),
    },
    {
      id: 3,
      title: "변화의 순간",
      author: "저자 1",
      coverImage:
      getRandomImage(),
    },
    {
      id: 4,
      title: "내일을 위한 오늘",
      author: "저자 1",
      coverImage:
      getRandomImage(),
    },
  ]

  const followedBooks = [
    {
      id: 1,
      title: "인생의 색채",
      author: "작가 A",
      coverImage:
      getRandomImage(),
    },
    {
      id: 2,
      title: "시간의 흐름",
      author: "작가 B",
      coverImage:
      getRandomImage(),
    },
    {
      id: 3,
      title: "마음의 소리",
      author: "작가 C",
      coverImage:
      getRandomImage(),
    },
    {
      id: 4,
      title: "꿈의 기록",
      author: "작가 D",
      coverImage:
      getRandomImage(),
    },
  ]

  return (
    <div className="space-y-8">
      {/* 저자의 다른 이야기 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold px-4">저자의 다른 이야기</h3>
        <div className="overflow-x-auto">
          <div className="flex px-4 pb-4">
            {authorBooks.map((book) => (
              <Card
                key={book.id}
                className="border-0 bg-transparent flex-shrink-0"
                style={{
                  width: "calc((100vw - 32px) / 3)",
                  maxWidth: "200px",
                  minWidth: "120px",
                  marginRight: "12px",
                }}
              >
                <CardContent className="p-0 space-y-2">
                  <AspectRatio ratio={156 / 234}>
                    <Image
                      src={book.coverImage || "/placeholder.svg"}
                      alt={book.title}
                      fill
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </AspectRatio>
                  <div className="space-y-1 px-1">
                    <h4 className="font-medium text-sm leading-tight line-clamp-2">{book.title}</h4>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* 구독 중인 작가의 자서전 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold px-4">구독 중인 작가의 자서전</h3>
        <div className="overflow-x-auto">
          <div className="flex px-4 pb-4">
            {followedBooks.map((book) => (
              <Card
                key={book.id}
                className="border-0 bg-transparent flex-shrink-0"
                style={{
                  width: "calc((100vw - 32px) / 3)",
                  maxWidth: "200px",
                  minWidth: "120px",
                  marginRight: "12px",
                }}
              >
                <CardContent className="p-0 space-y-2">
                  <AspectRatio ratio={156 / 234}>
                    <Image
                      src={book.coverImage || "/placeholder.svg"}
                      alt={book.title}
                      fill
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </AspectRatio>
                  <div className="space-y-1 px-1">
                    <h4 className="font-medium text-sm leading-tight line-clamp-2">{book.title}</h4>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

