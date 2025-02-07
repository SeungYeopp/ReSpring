"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { MobileLoading } from "./MobileLoading";
import { TabletLoading } from "./TabletLoading";
import { DesktopLoading } from "./DesktopLoading";

/**
 * ResponsiveProgressLoading
 * - 화면 크기에 따라 모바일/태블릿/데스크톱용 로딩 컴포넌트를 조건부 렌더링
 * - "progress" (0~100%)를 부모에서 관리, 자식에 props로 전달
 * - position: fixed + z-index를 높게 설정하여 항상 화면 최상단 중앙에 위치
 */
const ResponsiveProgressLoading = () => {
  // 1) 반응형 체크
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  // 2) "진행률" 상태를 부모에서 관리 (0 → 100%)
  const [progress, setProgress] = useState(0);

  // 3) 마운트 시 100ms 간격 타이머로 progress 증가
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer); // 100% 도달 시 타이머 해제
          return 100;
        }
        return prev + 1; // 0~99 구간에는 1%씩 증가
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  /**
   * 4) 로딩 컴포넌트를 화면 전역에 덮는 방식(fixed)으로 배치
   *    - inset-0: top/left/bottom/right = 0
   *    - z-50: 다른 요소들(스켈레톤 등)보다 위
   *    - flex+center: 중앙 정렬
   *    - bg-transparent: 투명 배경 (원하면 반투명 배경을 깔아서 뒤를 가릴 수도 있음)
   */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-4">
      {isMobile && <MobileLoading progress={progress} />}
      {isTablet && <TabletLoading progress={progress} />}
      {isDesktop && <DesktopLoading progress={progress} />}
    </div>
  );
};

export default ResponsiveProgressLoading;
