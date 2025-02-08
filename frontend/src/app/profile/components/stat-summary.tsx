"use client";

import React, { useState, useEffect } from "react";
import { getAllBooksByUserId } from "@/lib/api/book";

const StatSummary: React.FC<{ userId: string }> = ({ userId }) => {
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
      <div className="w-[90%] h-[2px] bg-[#96b23c]"></div>
      <div className="grid grid-cols-3 grid-rows-2 gap-4 p-4 w-[90%]">
        <div className="h-[30px] flex items-bottom justify-center text-4xl font-bold">12</div>
        <div className="h-[30px] flex items-bottom justify-center text-4xl font-bold">
          {bookCount !== null ? bookCount : "..."}
        </div>
        <div className="h-[30px] flex items-bottom justify-center text-4xl font-bold">13</div>
        <div className="h-[30px] flex justify-center">받은 응원 수</div>
        <div className="h-[30px] flex justify-center">봄날의 서 수</div>
        <div className="h-[30px] flex justify-center">도전 수</div>
      </div>
      <div className="w-[90%] h-[2px] bg-[#96b23c]"></div>
    </main>
  );
};

export default StatSummary;
