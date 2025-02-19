"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { searchChallenges } from "@/lib/api/tomorrow";
import type { Challenge } from "@/app/tomorrow/types/challenge";
import { GridChallengeCard } from "@/app/tomorrow/components/GridChallengeCard";
import { SearchBar } from "@/app/tomorrow/components/SearchBar";
import { SkeletonCard } from "@/components/custom/SkeletonCard";
import { SearchSummary } from "../components/SearchSummary";
import { useRecentSearches } from "@/app/tomorrow/hooks/useRecentSearches";
import { List, Filter } from "lucide-react";

// ProgressManager (오버레이 로딩 전용)
import ProgressManager from "@/components/custom/loading/ProgressManager";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { addRecentSearch } = useRecentSearches();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UPCOMING" | "ONGOING" | "ENDED">("ALL");

  // 쿼리 파라미터 변화 시 검색
  useEffect(() => {
    const newQuery = searchParams.get("q") || "";
    if (newQuery !== query) {
      setQuery(newQuery);
      performSearch(newQuery);
    }
  }, [searchParams]);

 // 예시: performSearch 함수 내에 로그 추가
const performSearch = useCallback(async (searchQuery: string) => {
  if (!searchQuery.trim() || searchQuery.length < 2) {
    setResults([]);
    return;
  }
  setLoading(true);

  try {
    // 테스트용 1초 인위적 지연
    // await new Promise((r) => setTimeout(r, 1000));

    const data = await searchChallenges(searchQuery);
    setResults(data);
    addRecentSearch(searchQuery);
  } catch (error) {
    setResults([]);
  } finally {
    setLoading(false);
  }
}, [addRecentSearch]);

  // 상태 필터링
  const filteredResults = 
    statusFilter === "ALL"
      ? results
      : results.filter((challenge) => challenge.status === statusFilter);

  return (
    <div className="container mx-auto px-4">
      {/* 검색바 */}
      <div className="mb-6 mt-4">
        <SearchBar placeholder="챌린지 검색" onSearchResults={setResults} />
      </div>

      {/* 검색 결과 헤더 + 필터 */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <List className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#96b23c]" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">검색 결과</h2>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            className="border rounded-md px-2 py-1 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "ALL" | "UPCOMING" | "ONGOING" | "ENDED")}
          >
            <option value="ALL">전체</option>
            <option value="UPCOMING">예정</option>
            <option value="ONGOING">진행 중</option>
            <option value="ENDED">종료됨</option>
          </select>
        </div>
      </div>

      {/* 검색 요약 (로딩 중이 아닐 때만) */}
      {query && !loading && (
        <SearchSummary query={query} resultCount={filteredResults.length} />
      )}

      {/* 
        ProgressManager를 전역 오버레이 로딩 전용으로 사용 
        - avgResponseTime=1500 => 1.5초 이상이면 즉시 오버레이
        - 100ms~500ms면 200ms 뒤 오버레이
      */}
      <ProgressManager
        avgResponseTime={1200}
        isLoading={loading}
        useResponsiveLoading
      >
        {/**
         * children:
         * - 스켈레톤은 페이지 내부에서 직접 렌더링
         * - loading === true => 스켈레톤 카드
         * - loading === false => 실제 결과
         */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} className="h-[200px] sm:h-[240px] md:h-[280px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4">
            {filteredResults.map((challenge) => (
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
        )}
      </ProgressManager>
    </div>
  );
}
