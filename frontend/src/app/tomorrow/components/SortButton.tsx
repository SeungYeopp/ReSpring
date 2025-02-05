"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { type SortOption, sortOptions } from "../types/challenge";

export default function SortButton() {
  const [currentSort, setCurrentSort] = useState<SortOption>("LATEST"); // ✅ 상태 관리

  const currentLabel = sortOptions.find((option) => option.value === currentSort)?.label || "정렬 기준";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-[#96b23c] text-[#96b23c] hover:bg-[#96b23c]/10 hover:text-[#96b23c] hover:border-[#96b23c]"
        >
          {currentLabel} <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setCurrentSort(option.value)} // ✅ 내부에서 직접 상태 변경
            className={currentSort === option.value ? "bg-[#96b23c]/10 text-[#96b23c]" : ""}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
