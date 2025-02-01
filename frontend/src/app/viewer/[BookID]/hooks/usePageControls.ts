"use client";

import { useEffect } from "react";
import { usePageContext } from "../context/PageContext";

export function usePageControls() {
  const { setCurrentPage } = usePageContext(); // ✅ Context에서 상태 관리

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setCurrentPage(-1); // ✅ 이전 페이지
      } else if (event.key === "ArrowRight") {
        setCurrentPage(1); // ✅ 다음 페이지
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setCurrentPage]);

  useEffect(() => {
    let startX = 0;

    const handleTouchStart = (event: TouchEvent) => {
      startX = event.touches[0].clientX;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const deltaX = startX - event.changedTouches[0].clientX;

      if (deltaX > 50) {
        setCurrentPage(1);
      } else if (deltaX < -50) {
        setCurrentPage(-1);
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [setCurrentPage]);
}
