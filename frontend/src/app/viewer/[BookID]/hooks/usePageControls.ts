"use client";

import { useEffect, useState } from "react";
import { usePageContext } from "../context/PageContext";
// 전역 패널 상태 관리 훅에서 열려 있는 패널의 개수를 가져옵니다.
import { usePanelContext } from "../context/usePanelContext";

/**
 * 페이지 이동 및 툴바 토글 관련 훅
 * - 좌우 터치로 페이지 넘김
 * - 중앙 터치로 툴바 표시/숨김
 * - 키보드 좌우 화살표로 페이지 넘김 (PC 대비)
 *
 * 이 훅은 전역 PanelContext의 openPanelsCount 값을 확인하여,
 * 하나라도 패널이 열려 있다면 (openPanelsCount > 0)
 * 페이지 이동 및 툴바 토글 이벤트를 무시하도록 합니다.
 */
export function usePageControls() {
  // 현재 페이지 상태를 변경하는 함수를 PageContext에서 가져옵니다.
  const { setCurrentPage } = usePageContext();
  // PanelContext에서 열려 있는 패널의 개수를 가져옵니다.
  const { openPanelsCount } = usePanelContext();

  // 툴바의 보임/숨김 상태를 관리하는 로컬 state입니다.
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  /**
   * 키보드 이벤트 리스너 등록
   * - 사용자가 키보드의 좌우 화살표를 누르면 페이지 이동을 수행합니다.
   * - 단, 전역 패널이 하나라도 열려 있다면(openPanelsCount > 0) 이벤트를 무시합니다.
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 열려 있는 패널이 하나라도 있다면 페이지 이동 이벤트를 무시합니다.
      if (openPanelsCount > 0) return;

      if (event.key === "ArrowLeft") {
        setCurrentPage(-1); // 왼쪽 화살표: 이전 페이지로 이동
      } else if (event.key === "ArrowRight") {
        setCurrentPage(1); // 오른쪽 화살표: 다음 페이지로 이동
      }
    };

    // document에 키보드 이벤트 리스너를 등록합니다.
    document.addEventListener("keydown", handleKeyDown);
    // 컴포넌트 언마운트 시 이벤트 리스너를 해제합니다.
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openPanelsCount, setCurrentPage]);

  /**
   * 터치 이벤트 리스너 등록
   * - 터치 시작 시 시작 위치(startX)를 기록합니다.
   * - 터치 종료 시 이동 거리를 계산하여,
   *   - 화면 왼쪽 25% 영역 클릭 시 이전 페이지로 이동,
   *   - 오른쪽 25% 영역 클릭 시 다음 페이지로 이동,
   *   - 중앙 영역 클릭 시 툴바를 토글합니다.
   * - 스와이프 동작(손가락을 크게 움직인 경우)도 동일하게 페이지 이동을 수행합니다.
   * - 단, 전역 패널이 하나라도 열려 있다면(openPanelsCount > 0) 터치 이벤트를 무시합니다.
   */
  useEffect(() => {
    let startX = 0; // 터치 시작 위치 X 좌표를 저장하는 변수

    // 터치 시작 시 호출되는 이벤트 핸들러
    const handleTouchStart = (event: TouchEvent) => {
      // 열려 있는 패널이 하나라도 있다면 터치 이벤트를 무시합니다.
      if (openPanelsCount > 0) return;
      startX = event.touches[0].clientX;
    };

    // 터치 종료 시 호출되는 이벤트 핸들러
    const handleTouchEnd = (event: TouchEvent) => {
      // 열려 있는 패널이 하나라도 있다면 터치 이벤트를 무시합니다.
      if (openPanelsCount > 0) return;

      const endX = event.changedTouches[0].clientX;
      const deltaX = startX - endX; // 터치 시작과 종료의 차이 계산
      const screenWidth = window.innerWidth; // 현재 화면 너비
      const leftBoundary = screenWidth * 0.25; // 왼쪽 25% 경계선
      const rightBoundary = screenWidth * 0.75; // 오른쪽 25% 경계선

      // 터치가 거의 움직이지 않은 경우(클릭)
      if (Math.abs(deltaX) < 5) {
        if (startX < leftBoundary) {
          setCurrentPage(-1); // 왼쪽 영역 클릭 시 이전 페이지로 이동
        } else if (startX > rightBoundary) {
          setCurrentPage(1); // 오른쪽 영역 클릭 시 다음 페이지로 이동
        } else {
          // 중앙 영역 클릭 시 툴바 토글 (보임/숨김)
          setIsToolbarVisible((prev) => !prev);
        }
        return;
      }

      // 터치가 스와이프(손가락을 크게 움직인 경우)인 경우 처리
      if (deltaX > 50) {
        setCurrentPage(1); // 오른쪽 스와이프: 다음 페이지로 이동
      } else if (deltaX < -50) {
        setCurrentPage(-1); // 왼쪽 스와이프: 이전 페이지로 이동
      }
    };

    // 터치 이벤트 리스너를 document에 등록합니다.
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    // 컴포넌트 언마운트 시 터치 이벤트 리스너를 해제합니다.
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [openPanelsCount, setCurrentPage]);

  // TopToolbar, BottomToolbar 등 다른 컴포넌트에서 툴바의 보임 상태를 사용할 수 있도록 반환합니다.
  return { isToolbarVisible };
}
