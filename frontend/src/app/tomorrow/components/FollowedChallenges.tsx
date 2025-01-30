"use client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { SliderChallengeCard } from "./SliderChallengeCard";
import { mockFollowedChallenges } from "../mocks/ChallengeMocks";

export default function FollowedChallenges() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent>
        {mockFollowedChallenges.map((challenge) => (
          <CarouselItem key={challenge.challenge_id} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <SliderChallengeCard
                id={challenge.challenge_id}
                image={challenge.cover_img || "/placeholder.webp"}
                title={challenge.title}
                description={challenge.description}
                tags={challenge.tags || []}
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
