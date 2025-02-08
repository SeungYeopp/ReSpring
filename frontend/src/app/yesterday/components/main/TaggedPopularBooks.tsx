"use client";

import { useState, useEffect } from "react";
import { MainBookCarousel } from "./MainBookCarousel";
import { likedBooks } from "./mocks/books";
import { Tag } from "lucide-react";
import { getAllBooks } from "@/lib/api/book";
import type { Book as BookType } from "../../types/maintypes";

// 랜덤으로 n개의 태그를 선택하는 함수
const getRandomTags = (tags: string[], n: number): string[] => {
  const shuffled = [...tags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

// 태그별로 책을 필터링하고 상위 10개만 반환하는 함수
const filterBooksByTag = (books: BookType[], tag: string): BookType[] => {
  return books.filter((book) => book.tags.includes(tag)).slice(0, 10);
};

export default function TaggedPopularBooks() {
  const [taggedBooks, setTaggedBooks] = useState<{ [key: string]: BookType[] }>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // 실제 API 호출
        const allBooks = await getAllBooks();

        // 모든 책에서 태그 수집 후 랜덤 5개 선택
        const allTags = allBooks.flatMap((book) => book.tags);
        const uniqueTags = Array.from(new Set(allTags));
        const randomTags = getRandomTags(uniqueTags, 5);
        setSelectedTags(randomTags);

        // 태그별로 책 필터링
        const booksByTag: { [key: string]: BookType[] } = {};
        randomTags.forEach((tag) => {
          booksByTag[tag] = filterBooksByTag(allBooks, tag);
        });
        setTaggedBooks(booksByTag);
      } catch (error) {
        console.error("API 호출 실패, 목데이터 사용:", error);

        // API 호출 실패 시 목데이터 사용
        const mockTags = getRandomTags(
          likedBooks.flatMap((book) => book.tags),
          5
        );
        setSelectedTags(mockTags);

        const mockBooksByTag: { [key: string]: BookType[] } = {};
        mockTags.forEach((tag) => {
          mockBooksByTag[tag] = filterBooksByTag(likedBooks, tag);
        });
        setTaggedBooks(mockBooksByTag);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (isLoading) {
    return <div className="mt-8">태그별 인기 책을 불러오는 중입니다...</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-spring-forest flex items-center">
        <Tag className="mr-2 h-6 w-6" />
        태그별 인기 서적 TOP 10
      </h2>
      {selectedTags.map((tag) => (
        <MainBookCarousel key={tag} title={`#${tag} TOP 10`} books={taggedBooks[tag]} />
      ))}
    </div>
  );
}
