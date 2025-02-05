"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { searchChallenges } from "@/lib/api/tomorrow";
import { Challenge } from "@/app/tomorrow/types/challenge";
import { ChallengeCard } from "@/app/tomorrow/components/ChallengeCard";
import { SearchBar } from "@/app/tomorrow/components/SearchBar";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);

  // 검색어 변경 시 API 호출
  useEffect(() => {
    if (query) {
      setLoading(true);
      searchChallenges(query)
        .then((data) => setResults(data))
        .catch((error) => console.error("검색 API 실패:", error))
        .finally(() => setLoading(false));
    }
  }, [query]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* 검색창 */}
      <SearchBar placeholder="챌린지 검색" onSearchResults={setResults} />

      {/* 검색 결과 */}
      <div className="mt-4">
        {loading ? (
          <p className="text-gray-500 text-center">검색 중...</p>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.map((challenge) => {
              const challengeWithOwner = challenge as Challenge & { ownerName?: string }; // ✅ 안전한 타입 캐스팅
              return (
                <ChallengeCard
                  key={challenge.id}
                  title={challenge.title}
                  description={challenge.description}
                  tags={[]} // 현재 API에 태그 데이터 없음 → 빈 배열로 처리
                  image={challenge.image}
                  ownerName={challengeWithOwner.ownerName} // ✅ 타입 오류 없이 안전하게 처리
                  participantCount={challenge.participantCount}
                  status={challenge.status}
                />
              );
            })}

          </div>
        ) : (
          <p className="text-gray-500 text-center">검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
