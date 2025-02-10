"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import type { LucideIcon } from "lucide-react"

// AnimatedIcon 컴포넌트의 props 타입 정의
interface AnimatedIconProps {
  Icon: LucideIcon
  size?: number
  color?: string
  strokeWidth?: number
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  Icon,
  size = 24,
  color = "url(#iconGradient)",
  strokeWidth = 2,
}) => {
  // SVG 요소에 대한 ref 생성
  const iconRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const iconElement = iconRef.current
    if (iconElement) {
      // 모든 path 요소 선택
      const paths = iconElement.querySelectorAll("path")
      paths.forEach((path) => {
        // 각 path의 전체 길이 계산
        const length = path.getTotalLength()

        // 스트로크 대시 배열과 오프셋 설정
        path.style.strokeDasharray = `${length} ${length}`
        path.style.strokeDashoffset = `${length}`

        // 애니메이션 설정
        path.style.animation = `drawIcon 2s ease forwards`
      })
    }
  }, [])

  return (
    <svg ref={iconRef} width={size} height={size}>
      <defs>
        {/* 그라데이션 정의 */}
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#2196F3" />
        </linearGradient>
      </defs>
      {/* Lucide 아이콘 렌더링 */}
      <Icon color={color} size={size} strokeWidth={strokeWidth} />
    </svg>
  )
}

export default AnimatedIcon

