"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface TabletLoadingProps {
  progress: number;
}

const getLeafStyle = (index: number) => {
  const colorClasses = [
    "bg-gradient-to-br from-green-300 to-green-400",
    "bg-gradient-to-br from-green-400 to-green-300",
    "bg-gradient-to-br from-green-200 to-green-300",
    "bg-gradient-to-br from-green-400 to-green-500",
  ];
  const sizeClasses = ["w-3 h-3", "w-[11px] h-[11px]", "w-[14px] h-[14px]", "w-[13px] h-[13px]"];
  return {
    color: colorClasses[index % 4],
    size: sizeClasses[index % 4],
  };
};

export function TabletLoading({ progress }: TabletLoadingProps) {
  const leaves = useMemo(() => Array.from({ length: 54 }), []);

  const renderLeaves = (ringSize: string, origin: string, animationClass: string) => (
    <div className={`absolute ${ringSize} ${animationClass}`}>
      {leaves.map((_, i) => {
        const { color, size } = getLeafStyle(i);
        return (
          <div
            key={i}
            className="absolute w-4 h-4"
            style={{
              transform: `rotate(${i * 6.67}deg)`,
              transformOrigin: origin,
            }}
          >
            <div
              className={cn("absolute", size, color, "shadow-sm")}
              style={{
                clipPath: 'path("M6 0 C9 3 9 9 6 12 C3 9 3 3 6 0")',
                transform: `rotate(${90 + i * 6.67}deg) translateX(1px)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="relative min-h-[300px] w-full flex items-center justify-center bg-transparent">
      {renderLeaves("w-48 h-48", "96px 96px", "animate-spin-slow")}
      {renderLeaves("w-44 h-44", "88px 88px", "animate-spin-slow-medium")}
      {renderLeaves("w-40 h-40", "80px 80px", "animate-spin-slow-reverse")}

      <div className="relative z-10 flex flex-col items-center gap-2">
        {/* 원형 프로그레스 바 */}
        <div className="relative w-20 h-20">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-green-100"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="transparent"
              r="36"
              cx="40"
              cy="40"
            />
            <circle
              className="text-green-300 transition-all duration-300"
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="36"
              cx="40"
              cy="40"
              style={{
                strokeDasharray: `${2 * Math.PI * 36}`,
                strokeDashoffset: `${2 * Math.PI * 36 * (1 - progress / 100)}`,
              }}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-extrabold text-green-600">
            {progress}
          </div>
        </div>

        <div className="text-2xl tracking-wider text-green-500/80 font-extrabold">불러오는 중</div>
      </div>
    </div>
  );
}
