"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface GoalSettingProps {
  onNext: () => void
  onPrevious: () => void
}

const GoalSetting: React.FC<GoalSettingProps> = ({ onNext, onPrevious }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  const goals = [
    "매일 아침 글쓰기",
    "하루 30분 걷기",
    "매주 한 편의 글 작성하기",
  ]

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-[#000000] text-center">
          봄날의 열매처럼, 당신의 목표를 설정해보세요!
        </h2>
        <p className="text-sm md:text-base text-[#7b7878] text-center mt-2">
          원하는 목표를 자유롭게 선택하세요. 지금 선택하지 않아도 나중에 언제든 설정할 수 있습니다.
        </p>
      </motion.div>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          {goals.map((goal, index) => (
            <div key={index} className="flex items-center space-x-2 bg-[#f0f0f0] p-3 rounded-lg">
              {/* <Checkbox
                id={`goal-${index}`}
                checked={selectedGoals.includes(goal)}
                onCheckedChange={() => handleGoalToggle(goal)}
              /> */}
              <Label htmlFor={`goal-${index}`} className="text-sm md:text-base text-[#000000] cursor-pointer flex-grow">
                {goal}
              </Label>
            </div>
          ))}
        </div>
        <div className="space-y-4 md:flex md:flex-row-reverse md:space-y-0 md:space-x-4 md:space-x-reverse">
          <Button type="submit" className="w-full md:w-1/2 bg-[#96b23c] text-[#ffffff] hover:bg-[#638d3e]">
            다음 단계로
          </Button>
          <Button
            type="button"
            onClick={onPrevious}
            variant="outline"
            className="w-full md:w-1/2 text-[#638d3e] hover:text-[#96b23c] border-[#dfeaa5]"
          >
            이전 단계로
          </Button>
        </div>
      </form>
    </div>
  )
}

export default GoalSetting

