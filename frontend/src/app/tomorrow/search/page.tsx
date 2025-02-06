"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { searchChallenges } from "@/lib/api/tomorrow";
import type { Challenge } from "@/app/tomorrow/types/challenge";
import { GridChallengeCard } from "@/app/tomorrow/components/GridChallengeCard";
import { SearchBar } from "@/app/tomorrow/components/SearchBar";
import { SkeletonCard } from "@/components/custom/SkeletonCard";
import { SearchSummary } from "../components/SearchSummary";
import { useRecentSearches } from "@/app/tomorrow/hooks/useRecentSearches";
import { List, Filter } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { recentSearches, addRecentSearch, clearRecentSearches } = useRecentSearches();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UPCOMING" | "ONGOING" | "ENDED">("ALL");

  // ✅ URL 변경 시 검색 실행 (검색어가 변경될 때 query 상태 자동 업데이트)
  useEffect(() => {
    const newQuery = searchParams.get("q") || "";
    if (newQuery !== query) {
      setQuery(newQuery);
      performSearch(newQuery);
    }
  }, [searchParams]);

  // ✅ API 요청 함수
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      const startTime = performance.now();
      try {
        const data = await searchChallenges(searchQuery);
        setResults(data);
        addRecentSearch(searchQuery);
      } catch (error) {
        console.error("검색 API 실패:", error);
        setResults([]);
      } finally {
        setSearchTime((performance.now() - startTime) / 1000);
        setLoading(false);
      }
    },
    [addRecentSearch]
  );

  // ✅ 검색바에서 검색 실행
  const handleSearchSubmit = (search: string) => {
    if (search.trim().length < 2) return;
    router.push(`/tomorrow/search?q=${encodeURIComponent(search)}`);
  };

  // ✅ 클라이언트 측 STATUS 필터 적용
  const filteredResults =
    statusFilter === "ALL" ? results : results.filter((challenge) => challenge.status === statusFilter);

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

        {/* STATUS 필터 UI */}
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            className="border rounded-md px-2 py-1 text-sm"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "ALL" | "UPCOMING" | "ONGOING" | "ENDED")
            }
          >
            <option value="ALL">전체</option>
            <option value="UPCOMING">예정</option>
            <option value="ONGOING">진행 중</option>
            <option value="ENDED">종료됨</option>
          </select>
        </div>
      </div>

      {/* 검색 요약 */}
      {query && !loading && <SearchSummary query={query} resultCount={filteredResults.length} />}

      {/* 필터 적용 후 결과 렌더링 */}
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

      {/* 로딩 시 Skeleton UI 적용 */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} className="h-[200px] sm:h-[240px] md:h-[280px]" />
          ))}
        </div>
      )}
    </div>
  );
}
