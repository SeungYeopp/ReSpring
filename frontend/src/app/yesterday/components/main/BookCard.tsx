"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { BookCardProps } from "../../types/maintypes";

export function BookCard({ book }: BookCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const router = useRouter();

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/yesterday/${book.id}`);
  };

  // 랜덤 플레이스홀더 이미지 생성
  const placeholderImage = `/placeholder/bookcover/thumb (${Math.floor(Math.random() * 7) + 1}).webp`;

  return (
    <div className="relative cursor-pointer border border-gray-300 rounded-lg shadow-sm" style={{ perspective: "1000px" }} onClick={() => setIsFlipped(!isFlipped)}>
      <div className="pb-[150%] relative">
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
            <img src={book.coverImg || placeholderImage} alt={book.title} className="w-full h-full object-cover rounded-lg" />
          </div>

          <div
            className="absolute inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center p-4 rounded-lg"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <h4 className="font-bold text-white text-lg text-center mb-4">{book.title}</h4>
            <Button onClick={handleDetailClick} variant="default" className="bg-blue-500 text-white hover:bg-blue-600">
              자세히 보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
