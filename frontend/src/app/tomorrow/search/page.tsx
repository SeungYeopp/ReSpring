"use client"; 
/**
 * Next.js 13(이상) App Router 전용 클라이언트 컴포넌트임을 표시하는 지시자.
 * "use client"가 없으면 브라우저 상호작용, useState, useEffect 등을 사용할 수 없음.
 */

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { searchChallenges } from "@/lib/api/tomorrow";           // 실제 챌린지 검색 API 함수
import type { Challenge } from "@/app/tomorrow/types/challenge"; // 챌린지 데이터 타입
import { GridChallengeCard } from "@/app/tomorrow/components/GridChallengeCard"; // 목록 카드 컴포넌트
import { SearchBar } from "@/app/tomorrow/components/SearchBar"; // 검색바 컴포넌트
import { SkeletonCard } from "@/components/custom/SkeletonCard"; // 스켈레톤(로딩용) 카드 컴포넌트
import { SearchSummary } from "../components/SearchSummary";      // 검색 요약 정보 컴포넌트
import { useRecentSearches } from "@/app/tomorrow/hooks/useRecentSearches"; // 최근 검색어 저장 훅
import { List, Filter } from "lucide-react";                      // 아이콘 컴포넌트
import ProgressManager from "@/components/custom/loading/ProgressManager"; // 로딩 전략 매니저

/**
 * SearchPage 컴포넌트
 * - /tomorrow/search 경로에서 사용될 메인 페이지.
 * - URL 쿼리 파라미터(q)에 따라 챌린지를 검색하여 결과 목록을 표시한다.
 * - ProgressManager를 이용해 로딩 중 스켈레톤 UI를 동적으로 제어한다.
 */
export default function SearchPage() {
  /**
   * ✅ Next.js 13 app router에서 제공하는 훅
   * - useSearchParams: 쿼리 파라미터를 읽고 변화에 대응.
   */
  const searchParams = useSearchParams();

  // ✅ 최근 검색어 관리 훅(로컬 스토리지 등)
  const { addRecentSearch } = useRecentSearches();

  // 🔍 상태 변수들
  const [query, setQuery] = useState(searchParams.get("q") || "");   // 검색어
  const [results, setResults] = useState<Challenge[]>([]);           // 검색 결과
  const [loading, setLoading] = useState(false);                     // 로딩 상태
  // const [searchTime, setSearchTime] = useState(0);                // (예시) 검색 소요 시간
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UPCOMING" | "ONGOING" | "ENDED">("ALL");
    // 상태 필터: ALL, UPCOMING(예정), ONGOING(진행 중), ENDED(종료)

  /**
   * ✅ 쿼리 파라미터(q)가 변경될 때마다 검색 실행
   * - useEffect 내에서 검색어가 변할 때마다 performSearch 호출
   */
  useEffect(() => {
    const newQuery = searchParams.get("q") || "";
    if (newQuery !== query) {
      setQuery(newQuery); 
      performSearch(newQuery);
    }
  }, [searchParams]); // searchParams가 변경되면 실행

  /**
   * ✅ 검색 API 호출 함수
   * - 검색어가 유효할 때만 API를 호출하고 결과를 상태에 저장
   * - 로딩 상태 설정, 에러 처리 등 담당
   */
  const performSearch = useCallback(
    async (searchQuery: string) => {
      // 1) 검색어가 없거나 2글자 미만일 경우, 결과 초기화
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true); // 로딩 시작
      // const startTime = performance.now(); // (선택) 검색 시간 측정 시작
      try {
        // 실제 서버 API 호출 (비동기)
        // (테스트 시 아래처럼 지연을 줘볼 수 있음)
        await new Promise((r) => setTimeout(r, 1000));
        const data = await searchChallenges(searchQuery);

        setResults(data);    // 검색 결과 업데이트
        addRecentSearch(searchQuery); // 최근 검색어 기록
      } catch (error) {
        console.error("검색 API 실패:", error);
        setResults([]); // 실패 시 결과 초기화
      } finally {
        setLoading(false); // 로딩 종료
        // setSearchTime((performance.now() - startTime) / 1000); // (선택) 검색 시간 기록
      }
    },
    [addRecentSearch]
  );

  /**
   * ✅ 클라이언트 측 상태 필터링
   * - 상태 필터에 따라 결과를 분류(ALL이면 전체, 아니면 해당 상태만)
   */
  const filteredResults = 
    statusFilter === "ALL"
      ? results
      : results.filter((challenge) => challenge.status === statusFilter);

  return (
    <div className="container mx-auto px-4">
      {/* 
        1) 검색바
           - 사용자가 검색어를 입력해 submit하면
             /tomorrow/search?q=... 형태로 라우팅 
             그리고 useEffect에서 performSearch를 재호출
      */}
      <div className="mb-6 mt-4">
        <SearchBar placeholder="챌린지 검색" onSearchResults={setResults} />
      </div>

      {/* 
        2) 검색 결과 상단 영역
           - 검색 결과 제목 + 필터 UI 
      */}
      <div className="mb-4 flex justify-between items-center">
        {/* 왼쪽: "검색 결과" 제목 */}
        <div className="flex items-center">
          <List className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#96b23c]" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">검색 결과</h2>
        </div>

        {/* 오른쪽: STATUS 필터 (전체, 예정, 진행 중, 종료) */}
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

      {/* 
        3) 검색 요약
           - 검색 쿼리(query)가 존재하고, 로딩 중이 아닐 때 요약 문구 표시
           - 예: "챌린지" 검색 결과 5건
      */}
      {query && !loading && (
        <SearchSummary query={query} resultCount={filteredResults.length} />
      )}

      {/**
       * 4) ProgressManager
       *   - 로딩 시점에 따라 스켈레톤을 자동으로 보여주는 컴포넌트
       *   - avgResponseTime(평균 응답 시간)에 따라
       *     - 100ms 이하 → 로딩 표시 없이 즉시 렌더
       *     - 100ms~500ms → 일정 지연 후 스켈레톤
       *     - 500ms 이상 → 즉시 스켈레톤 + 반응형 로딩 애니메이션
       */}
      <ProgressManager
        avgResponseTime={1500} // 예) "1.5초 이상이면 즉시 스켈레톤" 로직
        isLoading={loading}    // 현재 로딩 상태
        delayedSkeleton={
          // 100ms ~ 500ms 사이의 로딩 지연 시 보여줄 스켈레톤 (갯수 4개 예시)
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} className="h-[200px] sm:h-[240px] md:h-[280px]" />
            ))}
          </div>
        }
        immediateSkeleton={
          // 500ms 이상 로딩 시 즉시 보여줄 스켈레톤 (갯수 8개 예시)
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} className="h-[200px] sm:h-[240px] md:h-[280px]" />
            ))}
          </div>
        }
        useResponsiveLoading={true} 
      >
        {/* 
          5) children: 로딩이 끝난 후 실제 데이터를 렌더링할 영역.
             - 스켈레톤이 보이지 않도록 하려면
               "중복해서 같은 데이터를 그리지" 않도록 이 children 안에서만 리스트를 보여주면 됨.
        */}
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
              tags={[]}  // 태그 데이터가 없어서 임시로 빈 배열
              status={challenge.status}
            />
          ))}
        </div>
      </ProgressManager>
      
      {/**
       * ⚠️ 주의
       * 이전 코드에서는
       * {filteredResults.map(...)}를 "ProgressManager" 위에서도 한 번,
       * 아래에서도 또 한 번 렌더링했었음.
       * 중복 렌더링을 제거해야 스켈레톤이 제대로 보인다.
       */}
    </div>
  );
}
