"use client"

import { useEffect, useState, useCallback } from "react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { SliderChallengeCard } from "./SliderChallengeCard"
import { Calendar, Flame } from "lucide-react"
import type { ParticipatedChallenge } from "@/app/tomorrow/types/challenge"
import type { CarouselApi } from "@/components/ui/carousel"

interface MyChallengesProps {
  userId: string | null
  challenges: ParticipatedChallenge[] // 원래 타입을 유지합니다
}

export default function MyChallenges({ userId, challenges }: MyChallengesProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const onSelect = useCallback(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
  }, [api])

  useEffect(() => {
    if (!api) return

    api.on("select", onSelect)

    // 50초마다 다음 슬라이드로 이동
    const autoplayInterval = setInterval(() => {
      api.scrollNext()
    }, 50000)

    return () => {
      api.off("select", onSelect)
      clearInterval(autoplayInterval)
    }
  }, [api, onSelect])

  if (challenges.length === 0) {
    return <div className="text-center text-gray-500">참여 중인 도전이 없습니다.</div>
  }

  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
          loop: true, // 무한 루프 활성화
        }}
        className="w-full"
        setApi={setApi}
      >
        <CarouselContent>
          {challenges.map((challenge) => (
            <CarouselItem key={challenge.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                {" "}
                {/* 패딩을 추가하여 카드 사이에 간격을 줍니다 */}
                <SliderChallengeCard
                  id={challenge.id}
                  image={challenge.image || "/placeholder.webp"}
                  title={challenge.title}
                  description={
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{new Date(challenge.registerDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame size={14} className="text-red-500" />
                        <span>{challenge.currentStreak}일 연속</span>
                      </div>
                    </div>
                  }
                  tags={challenge.tags}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* 점 인디케이터 (최대 5개까지만 표시) */}
      <div className="flex justify-center mt-4">
        {" "}
        {/* mt-6에서 mt-4로 변경 */}
        {challenges.slice(0, 5).map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full mx-1 ${current === index ? "bg-blue-500" : "bg-gray-300"}`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`슬라이드 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </div>
  )
}

