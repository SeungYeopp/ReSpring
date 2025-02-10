"use client";

import { useState, useEffect } from "react";
import { type Book as OldBook } from "../../types/maintypes";
import { likedBooks } from "./mocks/books";
import { viewedBooks } from "./mocks/books";
import { MainBookCarousel } from "./MainBookCarousel";

// 임시 데이터를 가져오는 함수 (실제 API 호출을 시뮬레이션)
const fetchBooks = (books: OldBook[]): Promise<OldBook[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(books.slice(0, 10)), 1000); // 상위 10개만 반환
  });
};

export default function PopularBooks() {
  const [likedBooksData, setLikedBooksData] = useState<OldBook[]>([]);
  const [viewedBooksData, setViewedBooksData] = useState<OldBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const [liked, viewed] = await Promise.all([fetchBooks(likedBooks), fetchBooks(viewedBooks)]);
        setLikedBooksData(liked);
        setViewedBooksData(viewed);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllBooks();
  }, []);

  if (isLoading) {
    return <div className="mt-8 px-4">책 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-spring-forest">인기 서적 TOP 10</h2>
      <MainBookCarousel title="좋아요 순 TOP 10" books={likedBooksData} />
      <MainBookCarousel title="조회수 순 TOP 10" books={viewedBooksData} />
    </div>
  );
}
