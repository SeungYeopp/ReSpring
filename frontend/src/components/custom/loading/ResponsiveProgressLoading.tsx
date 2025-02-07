"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";  // 화면 크기별로 반응형 처리를 위한 훅
import { MobileLoading } from "./MobileLoading";    // 모바일용 로딩 애니메이션 컴포넌트
import { TabletLoading } from "./TabletLoading";    // 태블릿용 로딩 애니메이션 컴포넌트
import { DesktopLoading } from "./DesktopLoading";  // 데스크탑용 로딩 애니메이션 컴포넌트

/**
 * ResponsiveProgressLoading 컴포넌트
 * - 화면 크기에 따라 모바일, 태블릿, 데스크탑용 로딩 애니메이션을 자동으로 표시.
 * - 모든 화면 크기에서 로딩 진행률(progress)을 동기화하여 일관된 UX 제공.
 */
const ResponsiveProgressLoading = () => {
  // 🔍 화면 크기 감지하여 모바일/태블릿/데스크탑 여부 결정
  const isMobile = useMediaQuery({ maxWidth: 640 });               // 640px 이하: 모바일
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1023 }); // 641px ~ 1023px: 태블릿
  const isDesktop = useMediaQuery({ minWidth: 1024 });             // 1024px 이상: 데스크탑

  // 📈 로딩 진행률 상태 관리 (0% ~ 100%)
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // ⏲️ 100ms마다 progress 값을 1씩 증가시켜 로딩 애니메이션 효과 생성
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {     // 🔔 100%에 도달하면 타이머 종료
          clearInterval(timer);
          return 100;         // 로딩 완료 시 100%로 고정
        }
        return prev + 1;      // 로딩 진행 중일 때 1%씩 증가
      });
    }, 100);  // 100ms 간격으로 업데이트 (1초에 10%씩 증가)

    // 🧹 컴포넌트 언마운트 시 타이머 정리 (메모리 누수 방지)
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4">
      {/* 🌐 화면 크기에 따라 다른 로딩 애니메이션 표시 */}
      {isMobile && <MobileLoading />}   {/* 모바일 화면일 때 MobileLoading 컴포넌트 렌더링 */}
      {isTablet && <TabletLoading />}   {/* 태블릿 화면일 때 TabletLoading 컴포넌트 렌더링 */}
      {isDesktop && <DesktopLoading />} {/* 데스크탑 화면일 때 DesktopLoading 컴포넌트 렌더링 */}
    </div>
  );
};

export default ResponsiveProgressLoading;
