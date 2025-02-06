"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { MobileLoading } from "./MobileLoading";
import { TabletLoading } from "./TabletLoading";
import { DesktopLoading } from "./DesktopLoading";

/**
 * ResponsiveProgressLoading 컴포넌트
 * - 화면 크기에 따라 다른 로딩 애니메이션을 표시.
 * - 프로그레스 바는 모든 화면 크기에서 동기화.
 */
const ResponsiveProgressLoading = () => {
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4">
      {/* 화면 크기에 따라 다른 로딩 애니메이션 표시 */}
      {isMobile && <MobileLoading />}
      {isTablet && <TabletLoading />}
      {isDesktop && <DesktopLoading />}

      
    </div>
  );
};

export default ResponsiveProgressLoading;
