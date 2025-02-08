"use client"

import React from "react";

import {SearchBar} from "@/components/custom/SearchBar"
import { useSearchParams } from "next/navigation";
import {BookSearchResult} from "@/app/yesterday/components/BookSearchResult"
import { YesterdayMain } from "./components/YesterdayMain";
import BubbleMenuYesterday from "@/components/custom/BubbleMenuYesterday"
import Category from "./components/Category";
import {useRouter} from "next/navigation"

export default function Yesterday() {
  const router = useRouter();
  const searchParams = useSearchParams()

  const searchQuery = searchParams && searchParams.get("q");

  return (
    <div className="flex flex-col items-center justify-center">
      <SearchBar defaultValue={""} placeholder="봄날의 서, 작가 검색.."></SearchBar>
      {
      searchQuery ? 
      <BookSearchResult query = {searchQuery} /> : 
      <div>
        <YesterdayMain/>
        <Category />
      </div>
      }
      <BubbleMenuYesterday/>
    </div>
  );
}
