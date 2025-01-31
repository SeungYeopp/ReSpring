"use client";

import { useState, useEffect, useMemo } from "react";
import { GridChallengeCard } from "./GridChallengeCard";
import SortButton from "./SortButton";
import { fetchChallenges } from "@/lib/api";
import type { Challenge, SortOption } from "../types/challenge";
import { List } from "lucide-react";

export default function ChallengeList() {
  const [currentSort, setCurrentSort] = useState<SortOption>("recent");
  const [allChallenges, setAllChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadAllChallenges = async () => {
      setIsLoading(true);
      try {
        const data = await fetchChallenges(1, 1000); // 모든 챌린지를 한 번에 가져옵니다.
        setAllChallenges(data.data);
      } catch (error) {
        console.error("Failed to load challenges:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllChallenges();
  }, []);

  const sortedChallenges = useMemo(() => {
    return [...allChallenges].sort((a, b) => {
      switch (currentSort) {
        case "likes":
          return b.like - a.like;
        case "views":
          return b.view - a.view;
        case "participants":
          return b.participants - a.participants;
        case "recent":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [allChallenges, currentSort]);

  const handleSortChange = (sort: SortOption) => {
    setCurrentSort(sort);
  };

  if (allChallenges.length === 0 && !isLoading) {
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
      {isLoading ? (
        <div className="text-center py-4">로딩 중...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {sortedChallenges.map((challenge) => (
            <GridChallengeCard
              key={challenge.challenge_id}
              id={challenge.challenge_id}
              title={challenge.title}
              description={challenge.description}
              image={challenge.cover_img}
              like={challenge.like}
              view={challenge.view}
              participants={challenge.participants}
              tags={challenge.tags}
            />
          ))}
        </div>
      )}
    </div>
  );
}
