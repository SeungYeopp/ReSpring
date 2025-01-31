"use client";

import React from "react";
import { useDynamicPages } from "../hooks/useDynamicPages";

interface ReaderProps {
  textData: string;
  currentPage: number; // ✅ 페이지 번호를 필수로 받도록 설정
}

export function Reader({ textData, currentPage }: ReaderProps) {
  const { pages } = useDynamicPages(textData);

  return (
    <div className="max-w-2xl mx-auto p-4">
      {pages[currentPage] ? (
        <div dangerouslySetInnerHTML={{ __html: pages[currentPage] }} />
      ) : (
        <div>해당 페이지가 없습니다.</div>
      )}
    </div>
  );
}
