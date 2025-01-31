"use client";
/**
 * 3단계: 반응형 (스와이프 & 키보드 이벤트) 처리 훅
 * - 모바일: 손가락 스와이프 (touch event)
 * - 데스크톱: 좌우 화살표 키 이벤트
 */
import { useEffect, useState } from "react";

interface UsePageControlsProps {
  totalPages: number;
}

export function usePageControls({ totalPages }: UsePageControlsProps) {
  const [currentPage, setCurrentPage] = useState(0); // ✅ 내부 상태 관리

  // 1️⃣ 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setCurrentPage((prev) => Math.max(prev - 1, 0));
      } else if (event.key === "ArrowRight") {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [totalPages]);

  // 2️⃣ 모바일 스와이프 처리 (touch event)
  useEffect(() => {
    let startX = 0;
    let endX = 0;

    const handleTouchStart = (event: TouchEvent) => {
      startX = event.touches[0].clientX;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      endX = event.changedTouches[0].clientX;
      const deltaX = startX - endX;

      if (deltaX > 50) {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
      } else if (deltaX < -50) {
        setCurrentPage((prev) => Math.max(prev - 1, 0));
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [totalPages]);

  return { currentPage, setCurrentPage }; // ✅ 내부에서 상태 반환
}
