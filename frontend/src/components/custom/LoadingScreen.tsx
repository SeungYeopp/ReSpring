import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sprout } from "lucide-react"

const loadingTexts = [
  "당신의 이야기를 불러오는 중...",
  "봄날의 추억을 정리하고 있어요...",
  "새로운 시작을 준비하고 있습니다...",
  "당신의 소중한 순간들을 모으는 중...",
  "곧 다시, 봄이 찾아올 거예요...",
]

const LoadingScreen: React.FC = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f0f0]">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360, 0],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          repeat: Number.POSITIVE_INFINITY,
        }}
        className="text-[#96b23c] mb-4"
      >
        <Sprout className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#638d3e] mb-2"
      >
        다시, 봄(Re:Spring)
      </motion.h1>
      <AnimatePresence mode="wait">
        <motion.p
          key={currentTextIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-[#7b7878] text-lg md:text-xl lg:text-2xl"
        >
          {loadingTexts[currentTextIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

export default LoadingScreen

