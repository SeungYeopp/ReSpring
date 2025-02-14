"use client";

import { useEffect, useState } from "react";
import { usePageContext } from "../context/PageContext";

/**
 * 페이지 이동 및 툴바 토글 관련 훅
 * - 좌우 터치로 페이지 넘김
 * - 중앙 터치로 툴바 표시/숨김
 * - 키보드 좌우 화살표로 페이지 넘김 (PC 대비)
 */
export function usePageControls() {
  const { setCurrentPage } = usePageContext(); // ✅ 현재 페이지 상태 변경하는 함수 가져옴

  // ✅ 툴바 보임/숨김 상태 (true면 보임, false면 숨김)
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  /**
   * ✅ 키보드 화살표 좌우 키로 페이지 넘기는 이벤트 리스너
   * (PC 환경 대비용)
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setCurrentPage(-1); // 왼쪽 화살표 → 이전 페이지
      } else if (event.key === "ArrowRight") {
        setCurrentPage(1); // 오른쪽 화살표 → 다음 페이지
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setCurrentPage]);

  /**
   * ✅ 터치 이벤트로 페이지 넘김 + 툴바 토글 처리
   */
  useEffect(() => {
    let startX = 0; // 터치 시작 위치 X좌표

    // 터치 시작 시 위치 기록
    const handleTouchStart = (event: TouchEvent) => {
      startX = event.touches[0].clientX;
    };

    // 터치 끝날 때 처리
    const handleTouchEnd = (event: TouchEvent) => {
      const endX = event.changedTouches[0].clientX;
      const deltaX = startX - endX; // 터치 시작과 끝의 차이 계산

      const screenWidth = window.innerWidth; // 화면 너비 가져옴
      const leftBoundary = screenWidth * 0.25; // 왼쪽 1/4 경계선
      const rightBoundary = screenWidth * 0.75; // 오른쪽 1/4 경계선

      // ✅ 1. 클릭(정지 터치)인지 확인 → 손가락 거의 안 움직였으면 클릭!
      if (Math.abs(deltaX) < 5) {
        if (startX < leftBoundary) {
          setCurrentPage(-1); // 왼쪽 1/4 → 이전 페이지
        } else if (startX > rightBoundary) {
          setCurrentPage(1); // 오른쪽 1/4 → 다음 페이지
        } else {
          setIsToolbarVisible((prev) => !prev); // 가운데 2/4 → 툴바 토글
        }
        return;
      }

      // ✅ 2. 스와이프 동작 (길게 손가락 움직였을 때)
      if (deltaX > 50) {
        setCurrentPage(1); // 오른쪽으로 스와이프 → 다음 페이지
      } else if (deltaX < -50) {
        setCurrentPage(-1); // 왼쪽으로 스와이프 → 이전 페이지
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    // 클린업(이벤트 해제) - 컴포넌트 사라지면 이벤트 제거해줘야 함
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [setCurrentPage]);

  // ✅ 툴바 상태 반환 (TopToolbar, BottomToolbar에서 사용하기 위함)
  return { isToolbarVisible };
}
