"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder: string;
}

export function SearchBar({ placeholder }: SearchBarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/tomorrow/search?q=${encodeURIComponent(searchTerm.trim())}`);
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
