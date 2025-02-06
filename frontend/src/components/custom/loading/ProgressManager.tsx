"use client";

import { ReactNode } from "react";
import DelayedSkeleton from "./DelayedSkeleton";  // 지연된 스켈레톤 컴포넌트

/**
 * ProgressManagerProps 타입 정의
 * - avgResponseTime: API 평균 응답 시간
 * - isLoading: 현재 로딩 상태
 * - delayedSkeleton: 지연된 스켈레톤 표시 (100ms ~ 500ms)
 * - immediateSkeleton: 즉시 스켈레톤 표시 (500ms 이상)
 * - loadingIndicator: 로딩 애니메이션 표시 (500ms 이상) - 이 부분 추가!
 */
interface ProgressManagerProps {
  avgResponseTime: number;
  isLoading: boolean;
  delayedSkeleton: ReactNode;
  immediateSkeleton: ReactNode;
  loadingIndicator?: ReactNode;  // 💡 이 부분 추가!
  children: ReactNode;
}

/**
 * API 응답 시간에 따라 로딩 UI 결정
 * - 100ms 이하: 로딩 없이 즉시 렌더링
 * - 100ms ~ 500ms: 지연된 스켈레톤 표시
 * - 500ms 이상: 즉시 스켈레톤 + 로딩 애니메이션 표시
 */
const determineProgressType = (avgResponseTime: number) => {
  if (avgResponseTime < 100) return "NO_INDICATOR";
  if (avgResponseTime < 500) return "DELAYED_SKELETON";
  return "IMMEDIATE_SKELETON";
};

/**
 * ProgressManager 컴포넌트
 * - API 응답 시간에 따라 자동으로 스켈레톤 및 로딩 애니메이션 적용
 */
export const ProgressManager = ({
  avgResponseTime,
  isLoading,
  delayedSkeleton,
  immediateSkeleton,
  loadingIndicator,  // 💡 이 부분 추가!
  children,
}: ProgressManagerProps) => {
  const progressType = determineProgressType(avgResponseTime);

  if (progressType === "IMMEDIATE_SKELETON" && isLoading) {
    return (
      <div>
        {immediateSkeleton}
        {loadingIndicator}  {/* 💡 로딩 애니메이션 표시 */}
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

  return children;
};

export default ProgressManager;
