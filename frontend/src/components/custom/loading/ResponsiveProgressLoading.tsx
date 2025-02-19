"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { MobileLoading } from "./MobileLoading";
import { TabletLoading } from "./TabletLoading";
import { DesktopLoading } from "./DesktopLoading";

interface ResponsiveProgressLoadingProps {
  isLoading: boolean;              // 부모에서 로딩 여부를 받아옴
  onFinish?: () => void;           // 로딩 컴포넌트가 언마운트될 때 처리할 콜백(선택)
}

/**
 * ResponsiveProgressLoading
 * - 부모가 주는 isLoading에 따라 0→99%로 진행률을 가짜로 증가시키고,
 *   로딩이 false가 되면 강제로 100% 표시 후 잠시 뒤 언마운트
 * - 화면 크기에 따라 Mobile/Tablet/Desktop 로딩을 렌더링
 */
const ResponsiveProgressLoading = ({ isLoading, onFinish }: ResponsiveProgressLoadingProps) => {
  // 반응형 체크
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  // 진행률(0~100)
  const [progress, setProgress] = useState(0);

  // "현재 로딩 UI를 보여줄지" 여부
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isLoading) {
      // 로딩 시작 시점
      setVisible(true);   // UI 표시
      setProgress(0);     // 0%부터 시작

      // 0→99%로 가짜 애니메이션
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 99) {
            clearInterval(timer!);
            return 99;
          }
          return prev + 1;
        });
      }, 50); // 0.05초마다 1%씩 증가
    } else {
      // 로딩이 false (끝)로 바뀌는 순간
      setProgress(100);   // 100%로 맞춤
      timer = setTimeout(() => {
        // 0.5초 후에 UI를 숨기거나 언마운트
        setVisible(false);
        onFinish?.();      // 필요하다면 부모로 콜백
      }, 500);
    }

    // 언마운트 or isLoading 변동 시 타이머 정리
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLoading, onFinish]);

  // visible이 false라면 JSX null (실제 DOM에서 제거)
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-4">
      {isMobile && <MobileLoading progress={progress} />}
      {isTablet && <TabletLoading progress={progress} />}
      {isDesktop && <DesktopLoading progress={progress} />}
    </div>
  );
};

export default ResponsiveProgressLoading;
