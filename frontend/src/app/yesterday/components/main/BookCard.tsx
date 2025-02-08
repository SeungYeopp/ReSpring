"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { BookCardProps } from "../../types/maintypes";
import { useResizeObserver } from "./useResizeObsever";

export function BookCard({ book }: BookCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const router = useRouter();

  // 카드 크기 감지
  const { ref, size } = useResizeObserver();

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/yesterday/${book.id}`);
  };

  const placeholderImage = `/placeholder/bookcover/thumb (${Math.floor(Math.random() * 7) + 1}).webp`;

  // 카드 크기에 따라 폰트 크기 및 버튼 크기 계산
  const fontSize = Math.max(6, size.width * 0.08); // 최소 12px, 카드 크기에 비례
  const buttonFontSize = Math.max(6, size.width * 0.06); // 최소 10px, 비례 조정
  const buttonPadding = Math.max(2, size.width * 0.04); // 패딩도 카드 크기에 비례

  return (
    <div
      ref={ref} // 크기 감지
      className="relative cursor-pointer border border-gray-300 rounded-lg shadow-sm transition-transform duration-300 "
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="pb-[150%] relative">
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* 앞면 */}
          <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
            <img src={book.coverImg || placeholderImage} alt={book.title} className="w-full h-full object-cover rounded-lg" />
          </div>

          {/* 뒷면 */}
          <div
            className="absolute inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center p-2 rounded-lg"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* 카드 크기에 따라 폰트 크기 조절 */}
            <h4 className="font-bold text-white text-center mb-2" style={{ fontSize: `${fontSize}px` }}>
              {book.title}
            </h4>

            {/* 버튼 크기도 카드 크기에 따라 조절 */}
            <Button
              onClick={handleDetailClick}
              variant="default"
              className="bg-blue-500 text-white hover:bg-blue-600"
              style={{
                fontSize: `${buttonFontSize}px`,
                padding: `${buttonPadding}px ${buttonPadding * 1.5}px`, // 가로 패딩은 세로보다 1.5배
              }}
            >
              자세히 보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
