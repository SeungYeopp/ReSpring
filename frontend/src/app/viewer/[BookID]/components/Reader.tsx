"use client";

import React from "react";
import { useDynamicPages } from "../hooks/useDynamicPages";
import { usePageContext } from "../context/PageContext"; // 페이지 이동(현재 페이지) 관련
import { useViewerSettings } from "../context/ViewerSettingsContext"; // 테마/폰트
import { cn } from "@/lib/utils"; // shadCN 유틸 (optional)

interface ReaderProps {
  textData: string;
}

export function Reader({ textData }: ReaderProps) {
  const { pages } = useDynamicPages(textData);
  const { currentPage } = usePageContext();
  const { fontSize } = useViewerSettings();

  return (
    <div
      style={{ fontSize: `${fontSize}px` }} // 폰트 크기 적용
      className="max-w-2xl mx-auto"
    >
      {pages[currentPage] ? <div dangerouslySetInnerHTML={{ __html: pages[currentPage] }} /> : <div>해당 페이지가 없습니다.</div>}
    </div>
  );
}
