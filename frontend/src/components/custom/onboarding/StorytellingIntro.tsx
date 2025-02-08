import React from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { SproutIcon as Seed, Sprout, Flower, Apple } from 'lucide-react'

interface StorytellingIntroProps {
  onNext: () => void
  onPrevious: () => void
}

const StorytellingIntro: React.FC<StorytellingIntroProps> = ({ onNext, onPrevious }) => {
  const steps = [
    { icon: Seed, title: "씨앗을 심다", description: "당신의 과거는 오늘의 씨앗이 됩니다. 타임라인에 당신의 경험을 기록해보세요." },
    { icon: Sprout, title: "새싹을 키우다", description: "당신의 이야기가 새싹처럼 자라납니다. 봄날의 기록을 작성하며 소중한 순간을 남겨보세요." },
    { icon: Flower, title: "꽃을 피우다", description: "다른 사람들과 공감하며 당신의 이야기를 꽃피워 보세요. 소셜 기능을 통해 연결하세요." },
    { icon: Apple, title: "열매를 맺다", description: "당신의 경험이 열매가 되어 다음 세대에게 전해집니다. 챌린지와 성취를 통해 새로운 목표를 세워보세요." },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#000000] text-center">스토리텔링 여정</h2>
      <div className="space-y-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex items-start space-x-4"
          >
            <step.icon className="w-8 h-8 text-[#96b23c] flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-[#000000]">{step.title}</h3>
              <p className="text-sm text-[#7b7878]">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <Button
        onClick={onNext}
        className="w-full bg-[#96b23c] text-[#ffffff] hover:bg-[#638d3e] mt-4"
      >
        다음 단계로
      </Button>
      <Button
        onClick={onPrevious}
        variant="outline"
        className="w-full text-[#638d3e] hover:text-[#96b23c] border-[#dfeaa5] mt-2"
      >
        이전 단계로
      </Button>
    </div>
  )
}

export default StorytellingIntro

