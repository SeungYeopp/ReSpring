"use client";

import React, { useState, useEffect } from "react";
import { getAllBooksByUserId } from "@/lib/api/book";
import Link from "next/link";

const StatSummary: React.FC<{ userNickname: string, challengeCount: number }> = ({ userNickname: userId, challengeCount: challengeCount }) => {
  const [bookCount, setBookCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchBookCount = async () => {
      try {
        const books = await getAllBooksByUserId(userId);
        setBookCount(books.length);
      } catch (error) {
        console.error("Failed to fetch book count:", error);
      }
    };

    fetchBookCount();
  }, [userId]);

  return (
    <main className="flex flex-col items-center">
      <div className="grid grid-cols-3 grid-rows-2 pt-6 gap-2 w-[90%]">
        <div className="h-[30px] flex items-bottom justify-center text-3xl font-bold">12</div>
        <Link href={`/yesterday/booklist/${userId}`} className="h-[30px] flex items-bottom justify-center text-3xl font-bold text-blue-500 hover:underline">
          {bookCount !== null ? bookCount : "..."}
        </Link>
        <div className="h-[30px] flex items-bottom justify-center text-3xl font-bold">{challengeCount}</div>
        <div className="h-[30px] flex justify-center">받은 응원</div>
        <Link href={`/yesterday/booklist/${userId}`} className="h-[30px] flex justify-center text-blue-500 hover:underline">
          봄날의 서
        </Link>
        <div className="h-[30px] flex justify-center">진행 도전</div>
      </div>
      <div className="mt-4 w-[80%] h-[1px] bg-[#96b23c]"></div>
    </main>
  );
};

export default StatSummary;
