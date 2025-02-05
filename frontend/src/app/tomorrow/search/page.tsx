"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { searchChallenges } from "@/lib/api/tomorrow";
import type { Challenge } from "@/app/tomorrow/types/challenge";
import { GridChallengeCard } from "@/app/tomorrow/components/GridChallengeCard";
import { SearchBar } from "@/app/tomorrow/components/SearchBar";
import { List } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);

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
    <div className="container mx-auto px-4">
      <div className="mb-6 mt-4">
        <SearchBar placeholder="챌린지 검색" onSearchResults={setResults} />
      </div>

      <div className="mb-4">
        <div className="flex items-center">
          <List className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#96b23c]" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">검색 결과</h2>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-4">검색 중...</p>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4">
          {results.map((challenge) => (
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
      ) : (
        <p className="text-gray-500 text-center py-4">검색 결과가 없습니다.</p>
      )}
    </div>
  );
}
