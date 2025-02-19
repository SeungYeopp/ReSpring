"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { searchChallenges } from "@/lib/api/tomorrow";
import type { Challenge } from "../types/challenge";
import { debounce } from "../utils/debounce";

interface SearchBarProps {
  placeholder: string;
  onSearchResults?: (results: Challenge[]) => void;
}

export function SearchBar({ placeholder, onSearchResults }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastResults, setLastResults] = useState<Challenge[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filteredSearches, setFilteredSearches] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    setRecentSearches(storedSearches);
    setFilteredSearches(storedSearches.slice(0, 10)); // 초기 10개 제한
  }, []);

  useEffect(() => {
    const query = searchParams.get("q");
    if (query && query.length > 1) {
      setSearchTerm(query);
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = async (term: string) => {
    if (!term.trim() || term.length < 2) {
      onSearchResults?.([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchChallenges(term.trim());

      if (JSON.stringify(results) !== JSON.stringify(lastResults)) {
        setLastResults(results);
        onSearchResults?.(results);
      }

      const updatedSearches = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 10);
      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

    } catch (error) {
      console.error("검색 실패:", error);
      onSearchResults?.([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (term.length < 2) {
        setFilteredSearches(recentSearches.slice(0, 10)); // 초기 최근 검색어 10개 유지
        return;
      }

      try {
        const results = await searchChallenges(term.trim());
        onSearchResults?.(results);

        //   입력한 검색어가 포함된 최근 검색어 필터링
        setFilteredSearches(
          recentSearches.filter((search) => search.includes(term)).slice(0, 10)
        );
      } catch (error) {
        console.error("검색 실패:", error);
        onSearchResults?.([]);
      }
    }, 300),
    [recentSearches]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    setLoading(true);
    debouncedSearch(newTerm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
    router.push(`/tomorrow/search?q=${encodeURIComponent(searchTerm.trim())}`);
    setShowDropdown(false);
  };

  const handleSelectSearch = (search: string) => {
    setSearchTerm(search);
    performSearch(search);
    router.push(`/tomorrow/search?q=${encodeURIComponent(search)}`);
    setShowDropdown(false);
  };

  const handleDeleteSearch = (search: string) => {
    const updatedSearches = recentSearches.filter((s) => s !== search);
    setRecentSearches(updatedSearches);
    setFilteredSearches(updatedSearches.slice(0, 10)); // 필터링된 목록도 즉시 반영
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };
  

  const clearRecentSearches = () => {
    setRecentSearches([]);
    setFilteredSearches([]); // 필터링된 목록도 즉시 반영
    localStorage.removeItem("recentSearches");
  };
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative w-full">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          className={`pr-10 h-12 border-2 rounded-full bg-white placeholder:text-gray-500 
            ${loading ? "border-yellow-500" : "border-[#96b23c]"} w-full 
          `}
          onFocus={() => setShowDropdown(true)}
        />
        <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <Search className="h-5 w-5 text-[#96b23c]" />
        </button>
      </form>

      {/* 최근 검색어 드롭다운 */}
      {showDropdown && filteredSearches.length > 0 && (
        <div className="absolute left-0 mt-2 bg-white border rounded-md shadow-md w-full max-h-60 overflow-auto z-50">
          {filteredSearches.map((search, index) => (
            <div key={index} className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <span onClick={() => handleSelectSearch(search)} className="flex-1">{search}</span>
              <button onClick={() => handleDeleteSearch(search)} className="text-red-500 hover:text-red-700">
                <X size={16} />
              </button>
            </div>
          ))}
          <div className="px-4 py-2 text-center text-sm text-gray-500 border-t">
            <button onClick={clearRecentSearches} className="text-red-500 hover:text-red-700">
              ✕ 전체 삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
