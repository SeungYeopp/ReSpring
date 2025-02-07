"use client";

import { useState, useEffect, ReactNode } from "react";

/**
 * DelayedSkeletonProps
 * - children: 표시할 스켈레톤 컴포넌트 (예: SkeletonCard, CustomSkeleton 등)
 * - delay: 스켈레톤 표시까지 기다릴 시간 (기본값: 200ms)
 * - isLoading: 현재 로딩 상태 (true일 때 스켈레톤 표시)
 */
interface DelayedSkeletonProps {
  children: ReactNode;
  delay?: number;
  isLoading: boolean;
}

/**
 * DelayedSkeleton 컴포넌트
 * - 로딩 시작 후 일정 시간(delay) 이상 지나야 스켈레톤을 표시.
 * - 빠른 응답 시 스켈레톤을 표시하지 않아 깜빡임(flickering)을 방지.
 * 
 * 사용 예:
 * <DelayedSkeleton isLoading={isLoading}>
 *   <SkeletonCard />
 * </DelayedSkeleton>
 */
const DelayedSkeleton = ({ children, delay = 200, isLoading }: DelayedSkeletonProps) => {
  // ⏳ 스켈레톤 표시 여부 상태 관리 (false: 숨김, true: 표시)
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    // 🔄 로딩이 완료되면 스켈레톤 숨김 (로딩 상태가 false로 변경될 때)
    if (!isLoading) {
      setShowSkeleton(false);
      return;
    }

    // ⏲️ delay 시간 이후에도 로딩 중이면 스켈레톤 표시
    const timer = setTimeout(() => {
      if (isLoading) setShowSkeleton(true);
    }, delay);

    // 🧹 컴포넌트 언마운트 시 타이머 정리 (메모리 누수 방지)
    return () => clearTimeout(timer);
  }, [isLoading, delay]);  // isLoading 또는 delay 값이 변경될 때마다 useEffect 재실행

  // ✅ 스켈레톤 표시 여부에 따라 렌더링 결정
  return showSkeleton ? <>{children}</> : null;
};

export default DelayedSkeleton;
