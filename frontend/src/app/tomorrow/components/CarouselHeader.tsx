"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { useEffect, useState } from "react"

// 캐러셀에 표시될 메시지 배열 (각 메시지는 두 줄로 구성)
const messages = [
  {
    line1: "🌱 다시, 봄 (Re:Spring)",
    line2: "오늘보다 더 나은 내일을 위해 도전하세요",
  },
  {
    line1: "🌿 새로운 시작, 새로운 기회",
    line2: "당신의 도전을 응원합니다",
  },
  {
    line1: "🍃 변화는 작은 한 걸음부터",
    line2: "함께 성장하는 우리",
  },
]

export function CarouselHeader() {
  // 현재 표시 중인 메시지의 인덱스를 관리하는 state
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // 5초마다 메시지를 변경하는 타이머 설정
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length)
    }, 5000) // 5초(5000ms) 간격으로 설정

    // 컴포넌트가 언마운트될 때 타이머를 정리합니다.
    return () => clearInterval(timer)
  }, [])

  return (
    // 캐러셀 헤더의 전체 컨테이너
    <div className="w-full bg-green-50 text-green-700 py-3 md:py-4">
      {/* shadcn/ui의 Carousel 컴포넌트 사용 */}
      <Carousel className="w-full max-w-xs md:max-w-md mx-auto">
        <CarouselContent>
          <AnimatePresence mode="wait">
            <CarouselItem key={currentIndex}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                {/* 첫 번째 줄: 더 큰 글씨와 굵은 폰트 */}
                <div className="text-sm md:text-base font-bold mb-1">{messages[currentIndex].line1}</div>
                {/* 두 번째 줄: 약간 작은 글씨 */}
                <div className="text-xs md:text-sm">{messages[currentIndex].line2}</div>
              </motion.div>
            </CarouselItem>
          </AnimatePresence>
        </CarouselContent>
      </Carousel>
    </div>
  )
}

