"use client"

import { useEffect, useState } from "react"
import { fetchParticipatedChallenges, fetchSubscribedUserChallenges } from "@/lib/api/tomorrow"
import type { Challenge, ParticipatedChallenge, SubscribedUserChallenge } from "@/app/tomorrow/types/challenge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { Trophy, Users } from "lucide-react"
import { SearchBar } from "./components/SearchBar"
import MyChallenges from "./components/MyChallenges"
import FollowedChallenges from "./components/FollowedChallenges"
import ChallengeList from "./components/ChallengeList"
import { CarouselHeader } from "@/components/custom/CarouselHeader"
import { carouselMessages } from "@/lib/constants"
import { SkeletonCarousel } from "@/components/custom/SkeletonCarousel"
import { Separator } from "@/components/ui/separator"
import BubbleMenuTomorrow from "./components/BubbleMenuTomorrow"
import { getSessionInfo } from "@/lib/api" // getSessionInfo 함수 import

interface ChallengeClientPageProps {
  serverChallenges: Challenge[]
}

export default function ChallengeClientPage({ serverChallenges }: ChallengeClientPageProps) {
  console.log("ChallengeClientPage 렌더링 시작");
  const router = useRouter()
  const [allChallenges, setAllChallenges] = useState<Challenge[]>(serverChallenges)
  const [myChallenges, setMyChallenges] = useState<ParticipatedChallenge[]>([])
  const [followedChallenges, setFollowedChallenges] = useState<SubscribedUserChallenge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  // 세션 정보를 통해 userId를 가져오기 위한 useEffect 추가
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionInfo = await getSessionInfo();
        setUserId(sessionInfo.userId);
      } catch (error) {
        console.error("세션 정보 로드 중 오류 발생:", error);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [participated, userChallenges] = await Promise.all([
          fetchParticipatedChallenges(),
          fetchSubscribedUserChallenges(),
        ])

        setMyChallenges(participated)
        setFollowedChallenges(userChallenges)
      } catch (error) {
        console.error("🚨 챌린지 데이터 로드 중 오류 발생:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="h-full flex flex-col flex-grow overflow-y-auto bg-white bg-opacity-50 bg-[url('/subtle-prism.svg')]  md:-my-4 sm:my-0">
      
      {/* 캐러셀 헤더 추가 */}
      <div className="">
        <CarouselHeader messages={carouselMessages.tomorrow} />
      </div>

      {/* 검색창 */}
      <div className="px-4 sm:px-6 py-4">
        <SearchBar placeholder="도전을 검색하세요!" />
      </div>

      <main className="flex-grow px-4 sm:px-6 space-y-8 sm:space-y-10 pb-14">
        {/* 나의 도전 이야기 섹션 */}
        <section>
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="font-laundrygothicbold text-lg sm:text-2xl font-bold text-gray-800 flex items-center">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-yellow-600" />
              나의 도전 이야기
            </h2>
          </div>
          {isLoading ? <SkeletonCarousel /> : <MyChallenges userId={userId} challenges={myChallenges} />}
        </section>

        <Separator />

        {/* 구독한 사람의 도전 섹션 */}
        <section>
          <h2 className="font-laundrygothicbold text-lg sm:text-2xl text-gray-800 mb-4 sm:mb-6 flex items-center">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#96b23c]" />
            구독한 사람의 도전
          </h2>
          {isLoading ? <SkeletonCarousel /> : <FollowedChallenges challenges={followedChallenges} />}
        </section>

        <Separator />

        {/* 모든 도전 리스트 섹션 (서버에서 받아온 데이터) */}
        <section>
          <ChallengeList initialChallenges={allChallenges} />
        </section>
      </main>

      {/* 우측 하단 플로팅 버튼 (버블 메뉴) */}
      <BubbleMenuTomorrow />
    </div>
  )
}
