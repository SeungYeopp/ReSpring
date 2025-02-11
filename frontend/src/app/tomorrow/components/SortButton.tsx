"use client";

import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { type SortOption, sortOptions } from "../types/challenge";

interface SortButtonProps {
  currentSort: SortOption;
  setCurrentSort: (sort: SortOption) => void;
}

export default function SortButton({ currentSort, setCurrentSort }: SortButtonProps) {
  const currentLabel = sortOptions.find((option) => option.value === currentSort)?.label || "정렬 기준";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-[#96b23c] text-[#96b23c] hover:bg-[#96b23c]/10 hover:text-[#96b23c] hover:border-[#96b23c]">
          <p className="font-laundrygothicregular">{currentLabel}</p> 
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {sortOptions.map((option) => (
          <DropdownMenuItem key={option.value} onClick={() => setCurrentSort(option.value)} className={currentSort === option.value ? "bg-[#96b23c]/10 text-[#96b23c]" : ""}>
            <p className="font-laundrygothicregular">{option.label}</p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
