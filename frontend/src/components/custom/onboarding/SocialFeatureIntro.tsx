import React from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SocialFeatureIntroProps {
  onNext: () => void
  onPrevious: () => void
}

const SocialFeatureIntro: React.FC<SocialFeatureIntroProps> = ({ onNext, onPrevious }) => {
  const sampleFriends = [
    { name: "김지혜", story: "은퇴 후 여행 이야기 작성 중" },
    { name: "이상훈", story: "가족과의 추억 기록 중" },
    { name: "박미영", story: "인생 2막 시작 이야기 공유 중" },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-[#000000] text-center">다른 사용자들과 연결하고 공감해보세요!</h2>
        <p className="text-sm text-[#7b7878] text-center mt-2">당신의 이야기를 통해 새로운 친구를 만들어보세요.</p>
      </motion.div>
      <div className="space-y-4">
        {sampleFriends.map((friend, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex items-center space-x-4 bg-[#f0f0f0] p-4 rounded-lg"
          >
            <Avatar>
              <AvatarImage src={`https://i.pravatar.cc/150?u=${friend.name}`} alt={friend.name} />
              <AvatarFallback>{friend.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <h3 className="font-semibold text-[#000000]">{friend.name}</h3>
              <p className="text-sm text-[#7b7878]">{friend.story}</p>
            </div>
            <Button variant="outline" className="text-[#638d3e] hover:text-[#96b23c] border-[#dfeaa5]">
              팔로우하기
            </Button>
          </motion.div>
        ))}
      </div>
      <Button
        onClick={onNext}
        className="w-full bg-[#96b23c] text-[#ffffff] hover:bg-[#638d3e]"
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

export default SocialFeatureIntro

