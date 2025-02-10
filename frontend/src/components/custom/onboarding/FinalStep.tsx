import React from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Sprout, Home, BookOpen, ArrowLeft, Check } from 'lucide-react'

interface FinalStepProps {
  onWriteRecord: () => void
  onGoToMainPage: () => void
  onGoBack: () => void
}

const FinalStep: React.FC<FinalStepProps> = ({ onWriteRecord, onGoToMainPage, onGoBack }) => {
  const completedSteps = [
    "봄날의 여정 시작",
    "타임라인 생성",
    "친구들과 연결",
    "목표 설정"
  ]

  return (
    <div className="space-y-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <Sprout className="w-24 h-24 mx-auto text-[#96b23c] mb-6" />
          <motion.div
            className="absolute top-0 right-0 -mr-2 -mt-2 bg-[#dfeaa5] rounded-full p-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 500, damping: 15 }}
          >
            <Check className="w-6 h-6 text-[#638d3e]" />
          </motion.div>
        </div>
        <motion.h2 
          className="text-3xl font-bold text-[#000000] mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          축하합니다! 🎉
        </motion.h2>
        <motion.p 
          className="text-xl text-[#000000] mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          당신의 봄날 여정이 시작되었습니다.
        </motion.p>
        <motion.p 
          className="text-[#7b7878] mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          이제 당신의 소중한 경험과 추억을 기록하고 공유할 준비가 되었습니다.
        </motion.p>
      </motion.div>

      <motion.div 
        className="bg-[#f0f0f0] rounded-lg p-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="font-semibold mb-2">완료한 단계</h3>
        <ul className="text-left">
          {completedSteps.map((step, index) => (
            <motion.li 
              key={index} 
              className="flex items-center text-[#638d3e] mb-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <Check className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{step}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Button
            onClick={onWriteRecord}
            className="w-full bg-[#96b23c] text-[#ffffff] hover:bg-[#638d3e] flex items-center justify-center py-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <BookOpen className="w-6 h-6 mr-3" />
            <div>
              <div className="font-semibold">봄날의 기록 작성하기</div>
              <div className="text-sm opacity-80">첫 번째 이야기를 남겨보세요</div>
            </div>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Button
            onClick={onGoToMainPage}
            variant="outline"
            className="w-full text-[#638d3e] hover:text-[#96b23c] border-[#dfeaa5] flex items-center justify-center py-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <Home className="w-6 h-6 mr-3" />
            <div>
              <div className="font-semibold">메인 페이지로 이동</div>
              <div className="text-sm opacity-80">타임라인에서 여정 시작하기</div>
            </div>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
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
    </div>
  )
}

export default FinalStep

