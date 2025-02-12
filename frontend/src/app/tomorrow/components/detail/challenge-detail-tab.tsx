"use client"

import { useState } from "react"
import { ChallengeCalendar } from "./challnege-callender"
import { ExpandableDescription } from "./expandable-description"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Zap } from "lucide-react"
import { format, parseISO, differenceInDays } from "date-fns"
import type { ChallengeDetail } from "../../types/challenge"
import { ChallengeActionButton } from "./challenge-action-button"
import type { Theme } from "../../types/theme"
import { joinChallenge } from "@/lib/api"
import { Separator } from "@/components/ui/separator"

interface ChallengeDetailTabProps {
  challenge: ChallengeDetail
}
const Divider = ({ thick = false }: { thick?: boolean }) => <div className={`h-px bg-gray-200 my-3 ${thick ? "h-0.5" : ""}`} />;

export function ChallengeDetailTab({ challenge }: ChallengeDetailTabProps) {
  const [localChallenge, setLocalChallenge] = useState(challenge)
  const [isParticipating, setIsParticipating] = useState(false)
  const [isTodayCompleted, setIsTodayCompleted] = useState(false)
  const [theme, setTheme] = useState<Theme>("light")

  const startDate = parseISO(localChallenge.startDate)
  const endDate = parseISO(localChallenge.endDate)

  const calculateTotalDays = () => {
    return differenceInDays(endDate, startDate) + 1
  }

  const calculateTotalSuccess = () => {
    return localChallenge.records
      ? Object.values(localChallenge.records).filter((status) => status === "SUCCESS").length
      : 0
  }

  const totalDays = calculateTotalDays()
  const totalSuccess = calculateTotalSuccess()

  const handleCompleteToday = async () => {
    try {
      // 실제 구현에서는 여기에 서버 액션이나 API 호출이 들어갈 것입니다
      setLocalChallenge((prev) => ({
        ...prev,
        records: {
          ...prev.records,
          [format(new Date(), "yyyy-MM-dd")]: "SUCCESS",
        },
        successToday: true,
      }))
      setIsTodayCompleted(true)
    } catch (error) {
      console.error("Failed to complete challenge:", error)
    }
  }

  // 챌린지 참가 핸들러
  const handleJoinChallenge = async () => {
    try {
      const userId = "현재 사용자 ID" // 여기에 실제 사용자 ID를 가져오는 로직 추가
      const success = await joinChallenge(localChallenge.id, userId)
      if (success) {
        setIsParticipating(true) // 참가 성공 시 상태 업데이트
      }
    } catch (error) {
      console.error("챌린지 참가 중 오류 발생:", error)
    }
  }

  return (
    <div className="space-y-6 p-5">
      {/* 태그와 참여자 목록을 같은 줄에 배치 */}
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2 -mb-3">
          {localChallenge.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-[#F8BBD0] text-gray-700">
              {tag}
            </Badge>
          ))}
        </div>
        <div></div>
      </div>

      <ExpandableDescription description={localChallenge.description}/>
      <Separator/>
      {/* 프로그레스와 참여 현황을 같은 줄에 배치 */}
      {/* 삭제할 부분 */}
      {/* <div className="flex justify-between items-center">
        <div className="w-3/5">
          <h4 className="text-base lg:text-lg font-semibold flex items-center mb-2">
            <CalendarIcon className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-blue-500" />
            성공률
          </h4>
          <Progress value={localChallenge.successRate} className="w-full" />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs lg:text-sm font-semibold flex items-center">
              <Flame className="w-4 h-4 lg:w-5 lg:h-5 mr-1 text-orange-600" />
              현재 연속 달성 {localChallenge.currentStreak}일
            </p>
            <p className="text-xs lg:text-sm">{localChallenge.successRate.toFixed(1)}%</p>
          </div>
        </div>
        <div className="text-right">
          <h4 className="text-base lg:text-lg font-semibold flex items-center justify-end mb-2">
            <Users className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-indigo-500" />
            참여 현황
          </h4>
          <Button variant="outline" size="sm" onClick={handleParticipantListClick} className="text-xs lg:text-sm">
            {localChallenge.participantCount}명 참여 중
          </Button>
        </div>
      </div> */}

      <div>
        <div className="flex justify-between items-center ">
          <h4 className="text-base lg:text-lg font-semibold flex items-center">
            <CalendarIcon className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-[#8BC34A]" />
            달성 기록
          </h4>
          <div className="flex items-center">
            <Zap className="w-4 h-4 lg:w-5 lg:h-5 mr-1 text-yellow-500" />
            <span className="text-sm lg:text-base font-semibold">성공률: {localChallenge.successRate.toFixed(1)}%</span>
          </div>
        </div>
        <ChallengeCalendar records={localChallenge.records || {}} startDate={startDate} endDate={endDate} />
      </div>

      <ChallengeActionButton
        isParticipating={isParticipating}
        isTodayCompleted={isTodayCompleted}
        theme={theme}
        onComplete={handleCompleteToday}
        onJoin={handleJoinChallenge}
      />
    </div>
  )
}

