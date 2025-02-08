"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { Inter } from "next/font/google"

// Inter 폰트 설정
const inter = Inter({ subsets: ["latin"] })

interface AnimatedTextProps {
  text: string
  duration: number
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, duration }) => {
  const textRef = useRef<SVGTextElement>(null)

  useEffect(() => {
    const textElement = textRef.current
    if (textElement) {
      const length = textElement.getComputedTextLength()
      textElement.style.strokeDasharray = `${length} ${length}`
      textElement.style.strokeDashoffset = `${length}`
      textElement.style.animation = `drawText ${duration}s linear forwards, fillText 1s ${duration}s linear forwards`
    }
  }, [duration])

  return (
    <svg width="100%" height="100%" viewBox="0 0 300 60">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#2196F3" />
        </linearGradient>
      </defs>
      <text
        ref={textRef}
        x="50%"
        y="50%"
        fontSize="24"
        fontFamily={inter.style.fontFamily}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="none"
        stroke="url(#gradient)"
        strokeWidth="1"
      >
        {text}
      </text>
    </svg>
  )
}

export default AnimatedText

