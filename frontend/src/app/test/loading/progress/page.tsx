"use client";

import { useState, useEffect } from "react";
import ProgressManager from "@/components/custom/loading/ProgressManager";
import { SkeletonCard } from "@/components/custom/SkeletonCard";
import LoadingIndicator from "@/components/custom/loading/LoadingIndicator";

/**
 * LoadingProgressPage
 * - ProgressManager의 로딩 상태 자동 적용 기능 테스트
 * - API 응답 시간에 따라 지연된 스켈레톤, 즉시 스켈레톤, 로딩 애니메이션 표시 여부 확인
 */
const LoadingProgressPage = () => {
  const avgResponseTime = 600;  // 테스트할 API 응답 시간 설정 (600ms로 설정: 즉시 스켈레톤 + 로딩 애니메이션)
  const [isLoading, setIsLoading] = useState(true);  // 로딩 상태 관리

  // 특정 시간 후 로딩 완료 시뮬레이션 (avgResponseTime보다 약간 짧게 설정)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 550);  // 550ms 후 로딩 종료
    return () => clearTimeout(timer);  // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <ProgressManager
        avgResponseTime={avgResponseTime}  // API 평균 응답 시간 전달
        isLoading={isLoading}  // 현재 로딩 상태 전달

        delayedSkeleton={<SkeletonCard />}  // 100ms ~ 500ms: 지연된 스켈레톤 표시
        immediateSkeleton={<SkeletonCard />}  // 500ms 이상: 즉시 스켈레톤 표시
        loadingIndicator={<LoadingIndicator />}  // 500ms 이상: 로딩 애니메이션 표시
      >
        {/* API 로딩이 완료되었을 때 실제 데이터 표시 */}
        <div className="text-xl text-green-600 font-semibold">
          데이터 로딩 완료! 🎉
        </div>
      </ProgressManager>
    </div>
  );
};

export default LoadingProgressPage;
