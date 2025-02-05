"use client";

import { useEffect, useState, useCallback } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { SliderChallengeCard } from "./SliderChallengeCard";
import { Calendar, Flame } from "lucide-react"; // ✅ 연속 도전 아이콘 추가
import { fetchParticipatedChallenges } from "@/lib/api/tomorrow"; // ✅ API 호출 추가
import type { ParticipatedChallenge } from "@/app/tomorrow/types/challenge";
import type { CarouselApi } from "@/components/ui/carousel";

interface MyChallengesProps {
  userId: string | null;
  challenges: ParticipatedChallenge[]; // ✅ 추가됨
}

export default function MyChallenges({ userId }: MyChallengesProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [challenges, setChallenges] = useState<ParticipatedChallenge[]>([]); // ✅ 챌린지 상태 추가

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;

    api.on("select", onSelect);

    // 5초마다 다음 슬라이드로 이동
    const autoplayInterval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => {
      api.off("select", onSelect);
      clearInterval(autoplayInterval);
    };
  }, [api, onSelect]);

  // ✅ API 호출 추가 (userId가 있을 경우에만)
  useEffect(() => {
    console.log("✅ useEffect 실행됨, userId:", userId); // userId 값 확인
    if (!userId) return;
  
    const loadChallenges = async () => {
      console.log("✅ API 요청 시작:", userId);
      try {
        const response = await fetchParticipatedChallenges(userId);
        console.log("✅ API 응답:", response);
        setChallenges(response);
      } catch (error) {
        console.error("🚨 챌린지 불러오기 실패:", error);
      }
    };
  
    loadChallenges();
  }, [userId]);
  
  if (challenges.length === 0) {
    return <div className="text-center text-gray-500">참여 중인 도전이 없습니다.</div>;
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
                <SliderChallengeCard
                  id={challenge.id}
                  image={challenge.image || "/placeholder.webp"}
                  title={challenge.title}
                  description={
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar size={16} />
                      {new Date(challenge.registerDate).toLocaleDateString()}{" "}
                      <span className="flex items-center gap-1">
                        <Flame size={16} className="text-red-500" />
                        {challenge.currentStreak}일 연속 참여
                      </span>
                    </div>
                  } // ✅ 등록 날짜 + 연속 도전 일수 표시
                  tags={challenge.tags}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* ✅ 점 인디케이터 (최대 5개까지만 표시) */}
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
  );
}
