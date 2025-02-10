"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sprout } from "lucide-react"
import { useRouter } from "next/navigation"

interface WelcomeScreenProps {
  onStart: () => void
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const router = useRouter()

  const onSkip = () => {
    router.push("/main")
  }

  return (
    <div className="text-center space-y-6 md:space-y-8 max-w-md mx-auto">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
        <Sprout className="w-24 h-24 md:w-32 md:h-32 mx-auto text-[#96b23c]" />
      </motion.div>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#000000]">
        새로운 계절, 새로운 이야기를 시작합니다.
      </h1>
      <p className="text-[#7b7878] md:text-lg">내 이야기가 당신의 유산이 됩니다.</p>
      <div className="space-y-4 md:flex md:flex-col md:space-y-4">
        <Button onClick={onStart} className="w-full bg-[#96b23c] text-[#ffffff] hover:bg-[#638d3e]">
          시작하기
        </Button>
        <Button
          onClick={onSkip}
          variant="outline"
          className="w-full text-[#638d3e] hover:text-[#96b23c] border-[#dfeaa5]"
        >
          둘러보기 건너뛰기
        </Button>
      </div>
    </div>
  )
}

export default WelcomeScreen

