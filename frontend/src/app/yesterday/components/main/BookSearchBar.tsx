"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, type ChangeEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface iSearchBar {
  defaultValue: string | null;
  placeholder: string;
}

export const BookSearchBar = ({ defaultValue, placeholder }: iSearchBar) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(defaultValue);
  const pathname = usePathname();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);
  };

  const handleSearch = () => {
    if (inputValue) return router.push(`${pathname}?q=${inputValue}`);
    else return router.push("/");
  };

  const handleKeyPress = (event: { key: any }) => {
    if (event.key === "Enter") return handleSearch();
  };

  return (
    <div className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="relative w-full"
      >
        <Input
          type="text"
          id="inputId"
          placeholder={placeholder}
          value={inputValue ?? ""}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          className="pr-10 h-12 border-2 rounded-full bg-white placeholder:text-gray-500 border-[#96b23c] w-full"
        />
        <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <Search className="h-5 w-5 text-[#96b23c]" />
        </button>
      </form>
    </div>
  );
};
