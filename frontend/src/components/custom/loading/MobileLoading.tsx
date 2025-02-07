"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

// 👉 progress를 props로 받아 사용
interface MobileLoadingProps {
  progress: number;
}

const getLeafStyle = (index: number) => {
  const colorClasses = [
    "bg-gradient-to-br from-green-300 to-green-400",
    "bg-gradient-to-br from-green-400 to-green-300",
    "bg-gradient-to-br from-green-200 to-green-300",
    "bg-gradient-to-br from-green-400 to-green-500",
  ];
  const sizeClasses = ["w-2 h-2", "w-[9px] h-[9px]", "w-[11px] h-[11px]", "w-[10px] h-[10px]"];
  return {
    color: colorClasses[index % 4],
    size: sizeClasses[index % 4],
  };
};

/**
 * MobileLoading
 * - 부모에게서 받은 progress로 로딩 원형 게이지 표시
 * - 잎(leaf) 애니메이션은 동일하게 출력
 * - 기존 useEffect 제거 (부모 컴포넌트에서 progress를 관리)
 */
export function MobileLoading({ progress }: MobileLoadingProps) {
  // 36개의 잎 렌더링
  const leaves = useMemo(() => Array.from({ length: 36 }), []);

  const renderLeaves = (ringSize: string, origin: string, animationClass: string) => (
    <div className={`absolute ${ringSize} ${animationClass}`}>
      {leaves.map((_, i) => {
        const { color, size } = getLeafStyle(i);
        return (
          <div
            key={i}
            className="absolute w-3 h-3"
            style={{
              transform: `rotate(${i * 10}deg)`,
              transformOrigin: origin,
            }}
          >
            <div
              className={cn("absolute", size, color, "shadow-sm")}
              style={{
                // 잎 모양 클리핑
                clipPath: 'path("M4 0 C6 2 6 6 4 8 C2 6 2 2 4 0")',
                transform: `rotate(${90 + i * 10}deg) translateX(1px)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="relative min-h-[200px] w-full flex items-center justify-center bg-transparent">
      {renderLeaves("w-32 h-32", "64px 64px", "animate-spin-slow")}
      {renderLeaves("w-28 h-28", "56px 56px", "animate-spin-slow-reverse")}

      {/* 중앙 컨텐츠 */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        {/* 원형 프로그레스 바 */}
        <div className="relative w-16 h-16">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-green-100"
              strokeWidth="3"
              stroke="currentColor"
              fill="transparent"
              r="29"
              cx="32"
              cy="32"
            />
            <circle
              className="text-green-300 transition-all duration-300"
              strokeWidth="3"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="29"
              cx="32"
              cy="32"
              style={{
                strokeDasharray: `${2 * Math.PI * 29}`,
                // progress에 따라 strokeDashoffset 조절
                strokeDashoffset: `${2 * Math.PI * 29 * (1 - progress / 100)}`,
              }}
            />
          </svg>

          {/* 게이지 중앙에 progress % 표시 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-extrabold text-green-600">
            {progress}
          </div>
        </div>

        <div className="text-lg tracking-wider text-green-500/80 font-extrabold">불러오는 중</div>
      </div>
    </div>
  );
}
