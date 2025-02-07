"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * DesktopLoading 컴포넌트
 * - 부모로부터 넘어온 progress(0~100)를 원형 게이지와 UI에 반영
 * - 잎(leaf) 애니메이션(72개)도 기존처럼 렌더링
 */
interface DesktopLoadingProps {
  progress: number; // 부모 컴포넌트(ResponsiveProgressLoading)에서 전달해주는 진행률
}

const getLeafStyle = (index: number) => {
  const colorClasses = [
    "bg-gradient-to-br from-green-300 to-green-400",
    "bg-gradient-to-br from-green-400 to-green-300",
    "bg-gradient-to-br from-green-200 to-green-300",
    "bg-gradient-to-br from-green-400 to-green-500",
  ];
  const sizeClasses = ["w-4 h-4", "w-[14px] h-[14px]", "w-[18px] h-[18px]", "w-[16px] h-[16px]"];

  return {
    color: colorClasses[index % 4],
    size: sizeClasses[index % 4],
  };
};

export function DesktopLoading({ progress }: DesktopLoadingProps) {
  /**
   * 72개의 leaf를 표시하기 위해 Array.from({ length: 72 })를 만듦
   * - useMemo로 한 번만 생성
   */
  const leaves = useMemo(() => Array.from({ length: 72 }), []);

  /**
   * ringSize: CSS 클래스 (w-64 h-64 등)
   * origin:   transform-origin 설정 (예: "128px 128px")
   * animationClass: spin 애니메이션 클래스 (예: "animate-spin-slow")
   */
  const renderLeaves = (ringSize: string, origin: string, animationClass: string) => (
    <div className={`absolute ${ringSize} ${animationClass}`}>
      {leaves.map((_, i) => {
        const { color, size } = getLeafStyle(i);
        return (
          <div
            key={i}
            className="absolute w-6 h-6"
            style={{
              transform: `rotate(${i * 5}deg)`,
              transformOrigin: origin,
            }}
          >
            <div
              className={cn("absolute", size, color, "shadow-sm")}
              style={{
                // 잎 모양을 만들기 위한 clipPath
                clipPath: 'path("M8 0 C12 4 12 12 8 16 C4 12 4 4 8 0")',
                // 가운데 축에 맞춰 회전 + 살짝 X축 이동
                transform: `rotate(${90 + i * 5}deg) translateX(1px)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="relative min-h-[400px] w-full flex items-center justify-center bg-transparent">
      {/* 외곽 3개의 ring(leaf) */}
      {renderLeaves("w-64 h-64", "128px 128px", "animate-spin-slow")}
      {renderLeaves("w-60 h-60", "120px 120px", "animate-spin-slow-medium")}
      {renderLeaves("w-56 h-56", "112px 112px", "animate-spin-slow-reverse")}

      {/* 중앙 컨텐츠 */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        {/* 원형 프로그레스 바 */}
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-green-100"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
              r="44"
              cx="48"
              cy="48"
            />
            <circle
              className="text-green-300 transition-all duration-300"
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="44"
              cx="48"
              cy="48"
              style={{
                // 2πr = (2 * π * 44)
                strokeDasharray: `${2 * Math.PI * 44}`,
                // offset을 progress에 따라 감소시켜 게이지가 차오르는 효과
                strokeDashoffset: `${2 * Math.PI * 44 * (1 - progress / 100)}`,
              }}
            />
          </svg>

          {/* 게이지 중앙에 퍼센트 표시 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-light text-green-600">
            {progress}%
          </div>
        </div>

        <div className="text-sm tracking-wider text-green-500/80 font-medium">PROCESSING</div>
      </div>
    </div>
  );
}
