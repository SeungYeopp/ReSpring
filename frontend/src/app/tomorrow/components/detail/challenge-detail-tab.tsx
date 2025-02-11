"use client"

import { useState } from "react"
import { ChallengeCalendar } from "./challnege-callender"
import { ExpandableDescription } from "./expandable-description"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Users, CalendarIcon, Flame } from "lucide-react"
import { format, parseISO, differenceInDays } from "date-fns"
import { ko } from "date-fns/locale"
import type { ChallengeDetail } from "../../types/challenge"
import type { ParticipantListResponse } from "../../types/Participants"
import { ParticipantListModal } from "./participant-list-modal"
import { ChallengeActionButton } from "./challenge-action-button"
import type { Theme } from "../../types/theme"
import { joinChallenge } from "@/lib/api"

interface ChallengeDetailTabProps {
  challenge: ChallengeDetail
}

export function ChallengeDetailTab({ challenge }: ChallengeDetailTabProps) {
  const [localChallenge, setLocalChallenge] = useState(challenge)
  const [isParticipantListOpen, setIsParticipantListOpen] = useState(false)
  const [participantList, setParticipantList] = useState<ParticipantListResponse | null>(null)
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

  const handleParticipantListClick = async () => {
    try {
      // 실제 구현에서는 여기에 API 호출이 들어갈 것입니다
      const response: ParticipantListResponse = {
        challengeId: localChallenge.id,
        participantCount: localChallenge.participantCount,
        participants: [
          {
            userId: "dd5a7b3c-d887-11ef-b310-d4f32d147183",
            nickname: "홍길동",
            profileImage: "http://example.com/profile.jpg",
          },
          {
            userId: "ff6b8c4d-d99f-11ef-b310-d4f32d147183",
            nickname: "김철수",
            profileImage: "http://example.com/profile2.jpg",
          },
        ],
      }
      setParticipantList(response)
      setIsParticipantListOpen(true)
    } catch (error) {
      console.error("Failed to fetch participant list:", error)
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
    <div className="space-y-6">
      {/* 태그와 도전 기간을 같은 줄에 배치 */}
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {localChallenge.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-[#F8BBD0] text-gray-700">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="text-right">
          <h4 className="text-sm lg:text-base font-semibold flex items-center justify-end mb-1">
            <CalendarIcon className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-[#8BC34A]" />
            도전 기간
          </h4>
          <p className="text-gray-600 text-xs lg:text-sm">
            {format(startDate, "yyyy.M.d", { locale: ko })} - {format(endDate, "yyyy.M.d", { locale: ko })}
          </p>
        </div>
      </div>

      <ExpandableDescription description={localChallenge.description} />

      {/* 프로그레스와 참여 현황을 같은 줄에 배치 */}
      <div className="flex justify-between items-center">
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
      </div>

      <div>
        <h4 className="text-lg font-semibold flex items-center mb-2">
          <CalendarIcon className="w-5 h-5 mr-2 text-[#8BC34A]" />
          달성 기록
        </h4>
        <ChallengeCalendar records={localChallenge.records || {}} startDate={startDate} endDate={endDate} />
      </div>

      <ChallengeActionButton
        isParticipating={isParticipating}
        isTodayCompleted={isTodayCompleted}
        theme={theme}
        onComplete={handleCompleteToday}
        onJoin={handleJoinChallenge}
      />

      {participantList && (
        <ParticipantListModal
          isOpen={isParticipantListOpen}
          onClose={() => setIsParticipantListOpen(false)}
          participants={participantList.participants}
          participantCount={participantList.participantCount}
        />
      )}
    </div>
  )
}

