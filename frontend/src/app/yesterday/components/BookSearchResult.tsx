"use client";

import type React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { bookData, type iBook } from "@/mocks/book/book-mockdata";

interface BookSearchResultProps {
  query: string;
}
// ✅ 랜덤 이미지 생성 함수
const getRandomImage = () => {
  const imageNumber = Math.floor(Math.random() * 9) + 1; // 1~7 숫자 랜덤 선택
  return `/placeholder/bookcover/thumb (${imageNumber}).webp`; // public 폴더 내 이미지 경로
};

export const BookSearchResult: React.FC<BookSearchResultProps> = ({ query }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-spring-forest">검색 결과: "{query}"</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookData.map((book: iBook) => (
          <Card key={book.title} className="flex overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="w-1/3 relative">
              <Image src={book.coverImg || getRandomImage()} alt={`${book.title} 표지`} layout="fill" objectFit="cover" />
            </div>
            <CardContent className="w-2/3 p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-spring-forest line-clamp-2">{book.title}</h3>
                <p className="text-sm text-gray-600 mt-1">저자: 김싸피</p>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{book.content}</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {book.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-spring-olive text-white">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
