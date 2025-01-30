"use client";

import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { SliderChallengeCard } from "./SliderChallengeCard";
import { fetchUserChallenges } from "../../../lib/api";
import type { UserChallenge } from "../types/challenge";

export default function MyChallenges() {
  const [challenges, setChallenges] = useState<UserChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChallenges = async () => {
      setIsLoading(true);
      try {
        const response = await fetchUserChallenges();
        setChallenges(response.data);
      } catch (error) {
        console.error("Error loading user challenges:", error);
        // 에러 처리 로직 추가 (예: 토스트 메시지 표시)
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenges();
  }, []);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (challenges.length === 0 && !isLoading) {
    return <div>참여 중인 도전이 없습니다.</div>;
  }

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent>
        {Array.isArray(challenges) &&
          challenges.map((challenge, index) => (
            <CarouselItem key={challenge.challenge_id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <SliderChallengeCard
                  id={challenge.challenge_id}
                  image="/placeholder.webp" // You might want to add an image field to the API response
                  title={challenge.title}
                  description={challenge.description}
                  tags={["도전", "습관"]} // You might want to add a tags field to the API response
                />
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
