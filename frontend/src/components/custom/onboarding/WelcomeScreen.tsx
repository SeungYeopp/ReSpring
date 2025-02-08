import React from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Sprout } from 'lucide-react'

interface WelcomeScreenProps {
  onStart: () => void
  onSkip: () => void
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onSkip }) => {
  return (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Sprout className="w-24 h-24 mx-auto text-[#96b23c]" />
      </motion.div>
      <h1 className="text-2xl font-bold text-[#000000]">
        새로운 계절, 새로운 이야기를 시작합니다.
      </h1>
      <p className="text-[#7b7878]">
        내 이야기가 당신의 유산이 됩니다.
      </p>
      <div className="space-y-4">
        <Button
          onClick={onStart}
          className="w-full bg-[#96b23c] text-[#ffffff] hover:bg-[#638d3e]"
        >
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

