"use client";

import { ReactNode } from "react";
import DelayedSkeleton from "./DelayedSkeleton";  // 지연된 스켈레톤 컴포넌트
import ResponsiveProgressLoading from "./ResponsiveProgressLoading";  // 반응형 로딩 애니메이션 컴포넌트

/**
 * ProgressManagerProps 타입 정의
 * - avgResponseTime: API 평균 응답 시간 (ms 단위)
 * - isLoading: 현재 로딩 상태 (true: 로딩 중, false: 로딩 완료)
 * - delayedSkeleton: 100ms ~ 500ms 동안 표시할 지연된 스켈레톤 UI
 * - immediateSkeleton: 500ms 이상 응답 지연 시 즉시 표시할 스켈레톤 UI
 * - useResponsiveLoading: 반응형 로딩 애니메이션 사용 여부 (500ms 이상 시 활성화)
 * - children: 데이터 로드 완료 후 렌더링할 실제 콘텐츠
 */
interface ProgressManagerProps {
  avgResponseTime: number;
  isLoading: boolean;
  delayedSkeleton: ReactNode;
  immediateSkeleton: ReactNode;
  useResponsiveLoading?: boolean;  // 💡 반응형 로딩 애니메이션 사용 여부 (기본값: false)
  children: ReactNode;
}

/**
 * API 응답 시간에 따라 로딩 UI 결정 함수
 * - avgResponseTime 값에 따라 어떤 로딩 UI를 표시할지 결정.
 * - 100ms 이하: 로딩 UI 없이 즉시 데이터 렌더링.
 * - 100ms ~ 500ms: 지연된 스켈레톤 표시.
 * - 500ms 이상: 즉시 스켈레톤 + (옵션에 따라) 반응형 로딩 애니메이션 표시.
 */
const determineProgressType = (avgResponseTime: number) => {
  if (avgResponseTime < 100) return "NO_INDICATOR";          // 100ms 이하: 즉시 데이터 표시
  if (avgResponseTime < 500) return "DELAYED_SKELETON";      // 100ms ~ 500ms: 지연된 스켈레톤 표시
  return "IMMEDIATE_SKELETON";                               // 500ms 이상: 즉시 스켈레톤 + 애니메이션
};

/**
 * ProgressManager 컴포넌트
 * - API 응답 시간과 로딩 상태에 따라 자동으로 스켈레톤 및 반응형 로딩 애니메이션을 적용.
 * - 로딩이 완료되면 실제 콘텐츠(children)를 렌더링.
 */
export const ProgressManager = ({
  avgResponseTime,
  isLoading,
  delayedSkeleton,
  immediateSkeleton,
  useResponsiveLoading = false,  // 💡 기본값: 반응형 로딩 애니메이션 비활성화
  children,
}: ProgressManagerProps) => {
  const progressType = determineProgressType(avgResponseTime);  // API 응답 시간에 따른 로딩 UI 결정

  // 500ms 이상 응답 지연 시: 즉시 스켈레톤 + 반응형 로딩 애니메이션(옵션)
  if (progressType === "IMMEDIATE_SKELETON" && isLoading) {
    return (
      <div>
        {immediateSkeleton}  {/* 즉시 표시할 스켈레톤 */}
        {useResponsiveLoading && <ResponsiveProgressLoading />}  {/* 💡 500ms 이상일 때 반응형 로딩 애니메이션 표시 */}
      </div>
    );
  }

  // 100ms ~ 500ms 응답 지연 시: 200ms 이후 지연된 스켈레톤 표시
  if (progressType === "DELAYED_SKELETON" && isLoading) {
    return (
      <DelayedSkeleton delay={200} isLoading={isLoading}>
        {delayedSkeleton}  {/* 200ms 이상 로딩 지연 시 표시할 스켈레톤 */}
      </DelayedSkeleton>
    );
  }

  return children;  // 로딩이 완료된 경우 실제 콘텐츠(children)를 렌더링
};

export default ProgressManager;
