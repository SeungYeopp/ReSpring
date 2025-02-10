"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SproutIcon as Seed, Sprout, Flower, Apple } from "lucide-react"

interface StorytellingIntroProps {
  onNext: () => void
  onPrevious: () => void
}

const StorytellingIntro: React.FC<StorytellingIntroProps> = ({ onNext, onPrevious }) => {
  const steps = [
    {
      icon: Seed,
      title: "씨앗을 심다",
      description: "당신의 과거는 오늘의 씨앗이 됩니다. 타임라인에 당신의 경험을 기록해보세요.",
    },
    {
      icon: Sprout,
      title: "새싹을 키우다",
      description: "당신의 이야기가 새싹처럼 자라납니다. 봄날의 기록을 작성하며 소중한 순간을 남겨보세요.",
    },
    {
      icon: Flower,
      title: "꽃을 피우다",
      description: "다른 사람들과 공감하며 당신의 이야기를 꽃피워 보세요. 소셜 기능을 통해 연결하세요.",
    },
    {
      icon: Apple,
      title: "열매를 맺다",
      description: "당신의 경험이 열매가 되어 다음 세대에게 전해집니다. 챌린지와 성취를 통해 새로운 목표를 세워보세요.",
    },
  ]

  return (
    <div className="space-y-6 md:space-y-8 max-w-2xl mx-auto">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-[#000000] text-center">스토리텔링 여정</h2>
      <div className="space-y-8 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex md:flex-col items-start md:items-center space-x-4 md:space-x-0 md:space-y-4"
          >
            <step.icon className="w-8 h-8 md:w-12 md:h-12 text-[#96b23c] flex-shrink-0" />
            <div className="md:text-center">
              <h3 className="font-semibold text-[#000000] md:text-lg">{step.title}</h3>
              <p className="text-sm md:text-base text-[#7b7878]">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="space-y-4 md:flex md:flex-row-reverse md:space-y-0 md:space-x-4 md:space-x-reverse">
        <Button onClick={onNext} className="w-full md:w-1/2 bg-[#96b23c] text-[#ffffff] hover:bg-[#638d3e]">
          다음 단계로
        </Button>
        <Button
          onClick={onPrevious}
          variant="outline"
          className="w-full md:w-1/2 text-[#638d3e] hover:text-[#96b23c] border-[#dfeaa5]"
        >
          이전 단계로
        </Button>
      </div>
    </div>
  )
}

export default StorytellingIntro

