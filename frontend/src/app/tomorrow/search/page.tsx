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
import { List, X, Filter } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const { recentSearches, addRecentSearch, clearRecentSearches } = useRecentSearches();

  // ✅ STATUS 필터 관련 상태 추가
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UPCOMING" | "ONGOING" | "ENDED">("ALL");

  // ✅ API 요청 함수 (무한 스크롤 제거)
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

  // ✅ 검색어(query) 변경 시 재검색
  useEffect(() => {
    if (query.length > 1) {
      performSearch(query);
    }
  }, [query]);

  // ✅ 클라이언트 측 STATUS 필터 적용
  const filteredResults = statusFilter === "ALL" ? results : results.filter((challenge) => challenge.status === statusFilter);

  // ✅ 검색바 콜백
  const handleSearchResults = (newResults: Challenge[]) => {
    setResults(newResults);
    setLoading(false);
  };

  // ✅ 최근 검색어 클릭 시 검색 수행
  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    router.push(`/tomorrow/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <div className="container mx-auto px-4">
      {/* 검색바 */}
      <div className="mb-6 mt-4">
        <SearchBar placeholder="챌린지 검색" onSearchResults={handleSearchResults} />
      </div>

      {/* 최근 검색어 */}
      {recentSearches.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">최근 검색어</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button key={index} onClick={() => handleRecentSearchClick(search)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                {search}
              </button>
            ))}
            <button onClick={clearRecentSearches} className="text-red-500 hover:text-red-700 text-sm flex items-center">
              <X size={16} className="mr-1" /> 전체 삭제
            </button>
          </div>
        </div>
      )}

      {/* 검색 결과 헤더 + 필터 */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <List className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#96b23c]" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">검색 결과</h2>
        </div>

        {/* STATUS 필터 UI */}
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <select className="border rounded-md px-2 py-1 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "ALL" | "UPCOMING" | "ONGOING" | "ENDED")}>
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

      {/* 로딩 시 GridChallengeCard 크기에 맞는 Skeleton 적용 */}
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
