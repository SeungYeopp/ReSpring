"use client";
import { useState, useMemo } from "react";
import { GridChallengeCard } from "./GridChallengeCard";
import SortButton from "./SortButton";
import type { Challenge, SortOption } from "../types/challenge";
import { List } from 'lucide-react';
import { SkeletonCard } from "@/components/custom/SkeletonCard";

interface ChallengeListProps {
  challenges: Challenge[];
  isLoading: boolean; // 새로 추가된 prop
}

export default function ChallengeList({ challenges, isLoading }: ChallengeListProps) {
  const [currentSort, setCurrentSort] = useState<SortOption>("LATEST");

  const sortedChallenges = useMemo(() => {
    return [...challenges].sort((a, b) => {
      switch (currentSort) {
        case "POPULAR":
          return b.likes - a.likes;
        case "MOST_PARTICIPATED":
          return b.participantCount - a.participantCount;
        case "LATEST":
        default:
          return new Date(b.registerDate).getTime() - new Date(a.registerDate).getTime();
      }
    });
  }, [challenges, currentSort]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <div className="flex items-center">
            <List className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#96b23c]" />
            <h2 className="text-xl sm:text-2xl font-bold font-laundrygothicbold text-gray-800">모든 도전</h2>
          </div>
          <SortButton currentSort={currentSort} setCurrentSort={setCurrentSort} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {[...Array(8)].map((_, index) => (
            <SkeletonCard key={index} className="w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (challenges.length === 0) {
    return <div className="text-center font-samlipoutline py-4">현재 진행 중인 챌린지가 없습니다.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <div className="flex items-center">
          <List className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#96b23c]" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 font-laundrygothicbold">모든 도전</h2>
        </div>
        <SortButton currentSort={currentSort} setCurrentSort={setCurrentSort} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {sortedChallenges.map((challenge) => (
          <GridChallengeCard
            key={challenge.id}
            id={challenge.id}
            title={challenge.title}
            description={challenge.description}
            image={challenge.image}
            like={challenge.likes}
            participants={challenge.participantCount}
            tags={[]} // Challenge에는 태그 없음. ChallengeDetail에 있음.
            status={challenge.status}
            // startDate={challenge.startDate} // 📌 백엔드에서 startDate 추가되면 활성화 예정
          />
        ))}
      </div>
    </div>
  );
}