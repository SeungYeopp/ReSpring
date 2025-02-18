"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home, BookOpen, ArrowLeft, Check } from "lucide-react"
import { useRouter } from "next/navigation"

interface FinalStepProps {
  onGoBack: () => void
  onSignUp: () => void
}

const FinalStep: React.FC<FinalStepProps> = ({ onGoBack, onSignUp }) => {
  const router = useRouter()
  const completedSteps = ["봄날의 여정 시작", "타임라인 생성", "친구들과 연결", "목표 설정"]

  const onWriteRecord = () => {
    router.push("/yesterday")
  }

  const onGoToMainPage = () => {
    router.push("/main")
  }

  return (
    <div className="space-y-6 md:space-y-6 text-center max-w-2xl mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <motion.div
          className="inline-flex items-center justify-center bg-[#dfeaa5] rounded-full p-2 mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          <Check className="w-5 h-5 md:w-6 md:h-6 text-[#638d3e]" />
        </motion.div>
        <motion.h2
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#000000] mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          🎉 <p></p>당신의 봄날 여정이 시작되었습니다. 
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl text-[#000000] mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          
        </motion.p>
        <motion.p
          className="text-[#7b7878] md:text-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          이제 당신의 소중한 경험과 추억을 기록하고 공유할 준비가 되었습니다.
        </motion.p>
      </motion.div>

      <motion.div
        className="bg-[#f0f0f0] rounded-lg p-4 md:p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {/* <h3 className="font-semibold mb-2 md:text-lg">완료한 단계</h3> */}
        <ul className="text-left">
          {completedSteps.map((step, index) => (
            <motion.li
              key={index}
              className="flex items-center text-[#638d3e] mb-1 md:text-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <Check className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
              <span>{step}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <div className="space-y-4 md:flex md:flex-row-reverse md:space-y-0 md:space-x-4 md:space-x-reverse">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="md:w-1/2"
        >
          <Button
            onClick={onSignUp}
            className="w-full bg-[#96b23c] text-[#ffffff] hover:bg-[#638d3e] flex items-center justify-center py-6 md:py-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <BookOpen className="w-6 h-6 mr-3" />
            <div>
              <div className="font-semibold">화원가입하기</div>
              <div className="text-sm opacity-80">당신의 여정을 시작하세요.</div>
            </div>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="md:w-1/2"
        >
          {/* <Button
            onClick={onGoToMainPage}
            variant="outline"
            className="w-full text-[#638d3e] hover:text-[#96b23c] border-[#dfeaa5] flex items-center justify-center py-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <Home className="w-6 h-6 mr-3" />
            <div>
              <div className="font-semibold">메인 페이지로 이동</div>
              <div className="text-sm opacity-80">첫 번째 여정 시작하기</div>
            </div>
          </Button> */}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
        <Button
          onClick={onGoBack}
          variant="ghost"
          className="w-full text-[#638d3e] hover:text-[#96b23c] flex items-center justify-center mt-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          이전 단계로
        </Button>
      </motion.div>
    </div>
  )
}

export default FinalStep