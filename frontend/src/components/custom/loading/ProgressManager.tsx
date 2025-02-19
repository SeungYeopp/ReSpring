"use client";

import { ReactNode, useState, useEffect } from "react";
import { DelayedRender } from "./DelayedRender"; // 지연 렌더링용 컴포넌트
import ResponsiveProgressLoading from "./ResponsiveProgressLoading";

/**
 * ProgressManagerProps
 * - avgResponseTime: API 평균 응답 시간 (ms)
 * - isLoading: 현재 로딩 중 여부
 * - useResponsiveLoading: 반응형 로딩(ResponsiveProgressLoading) 사용 여부 (기본값 false)
 * - children: 로딩이 아닐 때 렌더링할 실제 UI
 */
interface ProgressManagerProps {
  avgResponseTime: number;
  isLoading: boolean;
  useResponsiveLoading?: boolean;
  children: ReactNode;
}

/**
 * API 응답 시간에 따른 로딩 타입 분기
 * - 100ms 이하 => NO_INDICATOR (로딩 표시 없음)
 * - 100ms ~ 500ms => DELAYED_OVERLAY (200ms 뒤에 오버레이 표시)
 * - 500ms 이상 => IMMEDIATE_OVERLAY (즉시 오버레이 표시)
 */
const determineLoadingType = (time: number) => {
  if (time < 100) return "NO_INDICATOR";
  if (time < 500) return "DELAYED_OVERLAY";
  return "IMMEDIATE_OVERLAY";
};

/**
 * ProgressManager
 * - "전역 오버레이 로딩"만 담당
 * - 스켈레톤은 페이지별 로직에서 (또는 별도 컴포넌트) 처리
 */
export function ProgressManager({
  avgResponseTime,
  isLoading,
  useResponsiveLoading = false,
  children,
}: ProgressManagerProps) {
  const loadingType = determineLoadingType(avgResponseTime);
  // isLoading과는 별개로 오버레이 렌더링 여부를 제어하는 상태
  const [showOverlay, setShowOverlay] = useState(isLoading);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isLoading) {
      // 로딩 종료 후 500ms 동안 오버레이 유지 -> 얘 바꿀거면 ResponsiveProgressLoading.tsx도 바꿔야 함.
      timer = setTimeout(() => {
        setShowOverlay(false);
      }, 500);
    } else {
      // 로딩 시작 시점에 즉시 오버레이 표시
      setShowOverlay(true);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);


  // [A] 500ms 이상 => 즉시 오버레이
  if (loadingType === "IMMEDIATE_OVERLAY" && showOverlay) {
    return (
      <>
        {children}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          {useResponsiveLoading && <ResponsiveProgressLoading isLoading={isLoading} />}
        </div>
      </>
    );
  }

  // [B] 100ms ~ 500ms => 지연 오버레이 (200ms 뒤 표시)
  if (loadingType === "DELAYED_OVERLAY" && isLoading) {
    return (
      <>
        {children}
        <DelayedRender delay={200} isLoading={isLoading}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
            {/* {useResponsiveLoading && <ResponsiveProgressLoading isLoading={isLoading} />} */}
          </div>
        </DelayedRender>
      </>
    );
  }

  return <>{children}</>;
}

export default ProgressManager;
