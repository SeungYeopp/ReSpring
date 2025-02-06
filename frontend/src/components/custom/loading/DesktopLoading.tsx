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
  const sizeClasses = ["w-4 h-4", "w-[14px] h-[14px]", "w-[18px] h-[18px]", "w-[16px] h-[16px]"]
  return {
    color: colorClasses[index % 4],
    size: sizeClasses[index % 4],
  }
}

export function DesktopLoading() {
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

  const leaves = useMemo(() => Array.from({ length: 72 }), [])

  const renderLeaves = (ringSize: string, origin: string, animationClass: string) => (
    <div className={`absolute ${ringSize} ${animationClass}`}>
      {leaves.map((_, i) => {
        const { color, size } = getLeafStyle(i)
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
                clipPath: 'path("M8 0 C12 4 12 12 8 16 C4 12 4 4 8 0")',
                transform: `rotate(${90 + i * 5}deg) translateX(1px)`,
              }}
            />
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="relative min-h-[400px] w-full flex items-center justify-center bg-transparent">
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
                strokeDasharray: `${2 * Math.PI * 44}`,
                strokeDashoffset: `${2 * Math.PI * 44 * (1 - progress / 100)}`,
              }}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-light text-green-600">
            {progress}%
          </div>
        </div>

        <div className="text-sm tracking-wider text-green-500/80 font-medium">PROCESSING</div>
      </div>
    </div>
  )
}

