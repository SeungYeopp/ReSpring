"use client";

import { ReactNode } from "react";
import { DelayedRender } from "./DelayedRender";// 지연 렌더링용(아래 예시) 컴포넌트
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

  // [A] 500ms 이상 => 즉시 오버레이
  if (loadingType === "IMMEDIATE_OVERLAY" && isLoading) {
    return (
      <>
        {/* 뒤의 children도 렌더링할지 말지는 UX에 따라 선택
            만약 로딩 중엔 화면 뒤를 가리고 싶다면 children을 안 그릴 수도 있음 */}
        {children}

        {/* 오버레이 (화면 전체 덮기) */}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
          {useResponsiveLoading && <ResponsiveProgressLoading />}
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
            {useResponsiveLoading && <ResponsiveProgressLoading />}
          </div>
        </DelayedRender>
      </>
    );
  }

  // [C] 그 외(로딩X or 100ms 이하) => 로딩 표시 없이 children 바로 렌더
  return <>{children}</>;
}

export default ProgressManager;
