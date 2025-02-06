"use client"

import { useEffect, useState, useMemo } from "react"
import { cn } from "@/lib/utils"

const getLeafStyle = (index: number) => {
  const colorClasses = [
    "bg-gradient-to-br from-green-300 to-green-400",
    "bg-gradient-to-br from-green-400 to-green-300",
    "bg-gradient-to-br from-green-200 to-green-300",
    "bg-gradient-to-br from-green-400 to-green-500",
  ]
  const sizeClasses = ["w-2 h-2", "w-[9px] h-[9px]", "w-[11px] h-[11px]", "w-[10px] h-[10px]"]
  return {
    color: colorClasses[index % 4],
    size: sizeClasses[index % 4],
  }
}

export function MobileLoading() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer)
          return 100
        }
        return prevProgress + 1
      })
    }, 100)

    return () => clearInterval(timer)
  }, [])

  const leaves = useMemo(() => Array.from({ length: 36 }), [])

  const renderLeaves = (ringSize: string, origin: string, animationClass: string) => (
    <div className={`absolute ${ringSize} ${animationClass}`}>
      {leaves.map((_, i) => {
        const { color, size } = getLeafStyle(i)
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
                clipPath: 'path("M4 0 C6 2 6 6 4 8 C2 6 2 2 4 0")',
                transform: `rotate(${90 + i * 10}deg) translateX(1px)`,
              }}
            />
          </div>
        )
      })}
    </div>
  )

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
                strokeDashoffset: `${2 * Math.PI * 29 * (1 - progress / 100)}`,
              }}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-light text-green-600">
            {progress}%
          </div>
        </div>

        <div className="text-xs tracking-wider text-green-500/80 font-medium">PROCESSING</div>
      </div>
    </div>
  )
}

