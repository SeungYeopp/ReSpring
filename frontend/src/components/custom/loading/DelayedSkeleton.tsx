"use client";

import { useState, useEffect, ReactNode } from "react";

/**
 * DelayedSkeletonProps
 * - children: 표시할 스켈레톤 컴포넌트 (예: SkeletonCard, CustomSkeleton)
 * - delay: 스켈레톤 표시까지 기다릴 시간 (기본값: 200ms)
 * - isLoading: 현재 로딩 상태 (true일 때 스켈레톤을 표시)
 */
interface DelayedSkeletonProps {
  children: ReactNode;
  delay?: number;
  isLoading: boolean;
}

/**
 * DelayedSkeleton 컴포넌트
 * - 로딩 시작 후 일정 시간(delay) 이상 지나야 스켈레톤을 표시.
 * - 응답이 빠르면 스켈레톤을 아예 보여주지 않아 깜빡임 방지.
 */
const DelayedSkeleton = ({ children, delay = 200, isLoading }: DelayedSkeletonProps) => {
  const [showSkeleton, setShowSkeleton] = useState(false);  // 스켈레톤 표시 여부 상태 관리

  useEffect(() => {
    // 로딩이 끝나면 스켈레톤 숨김
    if (!isLoading) {
      setShowSkeleton(false);
      return;
    }

    // delay 시간만큼 기다린 후 로딩이 여전히 진행 중이면 스켈레톤 표시
    const timer = setTimeout(() => {
      if (isLoading) setShowSkeleton(true);
    }, delay);

    // 컴포넌트 언마운트 시 타이머 정리 (메모리 누수 방지)
    return () => clearTimeout(timer);
  }, [isLoading, delay]);

  // 스켈레톤 표시 여부에 따라 렌더링 결정
  return showSkeleton ? <>{children}</> : null;
};

export default DelayedSkeleton;
