"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { searchChallenges } from "@/lib/api/tomorrow"; // 검색 API 함수 불러오기
import { Challenge } from "../types/challenge";

interface SearchBarProps {
  placeholder: string;
  onSearchResults?: (results: Challenge[]) => void; // 검색 결과를 부모 컴포넌트로 전달하는 콜백
}

export function SearchBar({ placeholder, onSearchResults }: SearchBarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const results = await searchChallenges(searchTerm.trim());
      onSearchResults?.(results); // 검색 결과를 상위 컴포넌트로 전달
      router.push(`/tomorrow/search?q=${encodeURIComponent(searchTerm.trim())}`);
    } catch (error) {
      console.error("검색 실패:", error);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pr-10 h-12 border-2 border-[#96b23c] rounded-full bg-white placeholder:text-gray-500 focus-visible:ring-[#638d3e]"
      />
      <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <Search className="h-5 w-5 text-[#96b23c]" />
      </button>
    </form>
  );
}
