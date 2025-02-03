"use client";

import { useState, useMemo } from "react";
import { GridChallengeCard } from "./GridChallengeCard";
import SortButton from "./SortButton";
import { Challenge, SortOption } from "../types/challenge"; // 타입 가져오기
import { List } from "lucide-react";

interface ChallengeListProps {
  challenges: Challenge[];
}

export default function ChallengeList({ challenges }: ChallengeListProps) {
  const [currentSort, setCurrentSort] = useState<SortOption>("recent");

  const sortedChallenges = useMemo(() => {
    return [...challenges].sort((a, b) => {
      switch (currentSort) {
        case "likes":
          return b.likes - a.likes;
        case "views":
          return b.views - a.views;
        case "participants":
          return b.participantCount - a.participantCount;
        case "recent":
        default:
          return new Date(b.registerDate).getTime() - new Date(a.registerDate).getTime();
      }
    });
  }, [challenges, currentSort]);

  const handleSortChange = (sort: SortOption) => {
    setCurrentSort(sort);
  };

  if (challenges.length === 0) {
    return <div className="text-center py-4">현재 진행 중인 챌린지가 없습니다.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <div className="flex items-center">
          <List className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#96b23c]" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">모든 도전</h2>
        </div>
        <SortButton currentSort={currentSort} onSortChange={handleSortChange} />
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
            view={challenge.views}
            participants={challenge.participantCount}
            tags={[]} // Challenge에는 태그 없음. ChallengeDetail에 있음.
          />
        ))}
      </div>
    </div>
  );
}
