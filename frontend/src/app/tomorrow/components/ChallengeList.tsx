"use client";
import { useState, useEffect } from "react";
import { GridChallengeCard } from "./GridChallengeCard";
import SortButton from "./SortButton";
import type { Challenge, SortOption } from "../types/challenge";
import { fetchChallenges } from "@/lib/api/tomorrow";  // API 호출 함수
import { List } from "lucide-react";

interface ChallengeListProps {
  initialChallenges: Challenge[];  // 초기 데이터 (서버 사이드 렌더링으로 받은 값)
}

export default function ChallengeList({ initialChallenges }: ChallengeListProps) {
  const [currentSort, setCurrentSort] = useState<SortOption>("LATEST");
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [isLoading, setIsLoading] = useState(false);

  // 정렬 옵션이 변경될 때마다 서버에서 데이터 다시 가져오기
  useEffect(() => {
    const fetchSortedChallenges = async () => {
      setIsLoading(true);
      try {
        const sortedChallenges = await fetchChallenges(currentSort);  // 서버 API 호출
        setChallenges(sortedChallenges);
      } catch (error) {
        console.error("🚨 챌린지 목록 가져오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSortedChallenges();
  }, [currentSort]);

  if (isLoading) {
    return <div className="text-center py-4">챌린지를 불러오는 중입니다...</div>;
  }

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
        <SortButton currentSort={currentSort} setCurrentSort={setCurrentSort} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {challenges.map((challenge) => (
          <GridChallengeCard
            key={challenge.id}
            id={challenge.id}
            title={challenge.title}
            description={challenge.description}
            image={challenge.image}
            like={challenge.likes}
            participants={challenge.participantCount}
            tags={[]} 
            status={challenge.status}
          />
        ))}
      </div>
    </div>
  );
}
