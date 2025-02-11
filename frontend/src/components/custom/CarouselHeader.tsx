"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { useEffect, useState } from "react"

// 메시지를 props로 받도록 수정
interface CarouselHeaderProps {
  messages: { line1: string; line2: string }[]
}

export function CarouselHeader({ messages }: CarouselHeaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [messages.length]) // 메시지가 변경될 때 타이머 재설정

  return (
    <div className="w-full bg-green-50 text-green-700 py-3 md:py-4">
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
                <div className="text-sm md:text-base font-bold mb-1">
                  {messages[currentIndex].line1}
                </div>
                <div className="text-xs md:text-sm">
                  {messages[currentIndex].line2}
                </div>
              </motion.div>
            </CarouselItem>
          </AnimatePresence>
        </CarouselContent>
      </Carousel>
    </div>
  )
}
