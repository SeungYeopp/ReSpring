"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { searchChallenges } from "@/lib/api/tomorrow";
import type { Challenge } from "../types/challenge";
import { debounce } from "../utils/debounce";
import type React from "react";

interface SearchBarProps {
  placeholder: string;
  onSearchResults?: (results: Challenge[]) => void;
}

export function SearchBar({ placeholder, onSearchResults }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false); // ✅ 로딩 상태 추가
  const [lastResults, setLastResults] = useState<Challenge[]>([]); // ✅ 이전 검색 결과 저장

  useEffect(() => {
    const query = searchParams.get("q");
    if (query && query.length > 1) {
      setSearchTerm(query);
      performSearch(query);
    }
  }, [searchParams]);

  // ✅ API 호출 최적화: 이전 검색 결과와 동일하면 재검색 방지
  const performSearch = async (term: string) => {
    if (!term.trim() || term.length < 2) {
      onSearchResults?.([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchChallenges(term.trim());

      // ✅ 이전 검색 결과와 다를 때만 업데이트
      if (JSON.stringify(results) !== JSON.stringify(lastResults)) {
        setLastResults(results);
        onSearchResults?.(results);
      }
    } catch (error) {
      console.error("검색 실패:", error);
      onSearchResults?.([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 디바운싱된 검색 함수
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (term.length < 2) return; // 최소 2글자 이상 입력 시 실행

      try {
        const results = await searchChallenges(term.trim());
        onSearchResults?.(results);
      } catch (error) {
        console.error("검색 실패:", error);
        onSearchResults?.([]);
      }
    }, 300), // 300ms 대기 후 실행
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    setLoading(true); // ✅ 검색어 변경 시 로딩 상태 표시
    debouncedSearch(newTerm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
    router.push(`/tomorrow/search?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        className={`pr-10 h-12 border-2 rounded-full bg-white placeholder:text-gray-500 
          ${loading ? "border-yellow-500" : "border-[#96b23c]"} 
        `}
      />
      <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <Search className="h-5 w-5 text-[#96b23c]" />
      </button>
    </form>
  );
}
