"use client";

import { ReactNode } from "react";
import DelayedSkeleton from "./DelayedSkeleton";
import ResponsiveProgressLoading from "./ResponsiveProgressLoading";  // 반응형 로딩 컴포넌트 추가

/**
 * ProgressManagerProps 타입 정의
 * - avgResponseTime: API 평균 응답 시간
 * - isLoading: 현재 로딩 상태
 * - delayedSkeleton: 지연된 스켈레톤 표시 (100ms ~ 500ms)
 * - immediateSkeleton: 즉시 스켈레톤 표시 (500ms 이상)
 * - useResponsiveLoading: 반응형 로딩 애니메이션 사용 여부 (500ms 이상)
 * - children: 데이터 로드 완료 후 표시할 실제 콘텐츠
 */
interface ProgressManagerProps {
  avgResponseTime: number;
  isLoading: boolean;
  delayedSkeleton: ReactNode;
  immediateSkeleton: ReactNode;
  useResponsiveLoading?: boolean;  // 💡 반응형 로딩 애니메이션 사용 여부
  children: ReactNode;
}

/**
 * API 응답 시간에 따라 로딩 UI 결정
 * - 100ms 이하: 로딩 없이 즉시 렌더링
 * - 100ms ~ 500ms: 지연된 스켈레톤 표시
 * - 500ms 이상: 즉시 스켈레톤 + (옵션에 따라) 반응형 로딩 애니메이션 표시
 */
const determineProgressType = (avgResponseTime: number) => {
  if (avgResponseTime < 100) return "NO_INDICATOR";
  if (avgResponseTime < 500) return "DELAYED_SKELETON";
  return "IMMEDIATE_SKELETON";
};

/**
 * ProgressManager 컴포넌트
 * - API 응답 시간에 따라 스켈레톤 및 반응형 로딩 애니메이션 자동 적용
 */
export const ProgressManager = ({
  avgResponseTime,
  isLoading,
  delayedSkeleton,
  immediateSkeleton,
  useResponsiveLoading = false,  // 💡 기본값: 반응형 로딩 애니메이션 사용 안 함
  children,
}: ProgressManagerProps) => {
  const progressType = determineProgressType(avgResponseTime);

  if (progressType === "IMMEDIATE_SKELETON" && isLoading) {
    return (
      <div>
        {immediateSkeleton}
        {useResponsiveLoading && <ResponsiveProgressLoading />}  {/* 💡 500ms 이상일 때 반응형 로딩 애니메이션 표시 */}
      </div>
    );
  }

  if (progressType === "DELAYED_SKELETON" && isLoading) {
    return (
      <DelayedSkeleton delay={200} isLoading={isLoading}>
        {delayedSkeleton}
      </DelayedSkeleton>
    );
  }

  return children;  // 로딩이 완료되면 실제 콘텐츠 표시
};

export default ProgressManager;
