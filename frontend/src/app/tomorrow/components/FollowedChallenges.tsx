"use client"

import type React from "react"
import { useEffect, useState, useCallback, useRef } from "react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { SliderChallengeCard } from "./SliderChallengeCard"
import type { SubscribedUserChallenge } from "@/app/tomorrow/types/challenge"
import type { CarouselApi } from "@/components/ui/carousel"

interface FollowedChallengesProps {
  challenges: SubscribedUserChallenge[]
}

export default function FollowedChallenges({ challenges }: FollowedChallengesProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const onSelect = useCallback(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
  }, [api])

  useEffect(() => {
    if (!api) return

    api.on("select", onSelect)

    // 5초마다 다음 슬라이드로 이동 (자동 재생)
    const autoplayInterval = setInterval(() => {
      api.scrollNext()
    }, 5000)

    return () => {
      api.off("select", onSelect)
      clearInterval(autoplayInterval)
    }
  }, [api, onSelect])

  // 키보드 이벤트 핸들러 추가
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!api) return

      switch (event.key) {
        case "ArrowLeft":
          api.scrollPrev()
          break
        case "ArrowRight":
          api.scrollNext()
          break
      }
    },
    [api],
  )

  useEffect(() => {
    const element = carouselRef.current
    if (element) {
      element.tabIndex = 0 // 키보드 포커스를 받을 수 있도록 설정
    }
  }, [])

  if (challenges.length === 0) {
    return <div className="text-center text-gray-500">구독한 사람들이 도전을 진행하고 있지 않습니다....</div>
  }

  return (
    <div className="relative" ref={carouselRef} onKeyDown={handleKeyDown} aria-label="팔로우한 챌린지 슬라이더">
      <Carousel
        opts={{
          align: "start",
          loop: true, // 무한 루프 활성화
        }}
        className="w-full"
        setApi={setApi}
      >
        <CarouselContent>
          {Array.isArray(challenges) &&
            challenges.map((challenge) => (
              <CarouselItem key={challenge.challengeId} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <SliderChallengeCard
                    id={challenge.challengeId}
                    image={challenge.image || "/placeholder.webp"}
                    title={challenge.title}
                    description={challenge.description}
                    tags={[]}
                  />
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
      </Carousel>

      {/* 점 인디케이터 (최대 5개까지만 표시) */}
      <div className="flex justify-center mt-4">
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

