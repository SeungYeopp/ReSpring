"use client";

import { useEffect, useState, useCallback } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { SliderChallengeCard } from "./SliderChallengeCard";
import { Calendar } from "lucide-react";
import type { ParticipatedChallenge } from "@/app/tomorrow/types/challenge";
import type { CarouselApi } from "@/components/ui/carousel";

interface MyChallengesProps {
  challenges: ParticipatedChallenge[];
}

export default function MyChallenges({ challenges }: MyChallengesProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

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
          {Array.isArray(challenges) &&
            challenges.map((challenge) => (
              <CarouselItem key={challenge.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <SliderChallengeCard
                    id={challenge.id}
                    image={challenge.image || "/placeholder.webp"}
                    title={challenge.title}
                    description={
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        {new Date(challenge.registerDate).toLocaleDateString()}
                      </div>
                    }
                    tags={challenge.tags}
                  />
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* 점 인디케이터 추가 */}
      <div className="flex justify-center mt-4">
        {challenges.map((_, index) => (
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
