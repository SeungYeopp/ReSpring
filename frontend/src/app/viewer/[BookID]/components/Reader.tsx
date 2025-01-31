"use client";

import React, { useState } from "react";
import { useDynamicPages } from "../hooks/useDynamicPages";

interface ReaderProps {
  textData: string;
  currentPage: number;            // 현재 페이지 (상위에서 관리)
}

export function Reader({ textData, currentPage }: ReaderProps) {
  const { pages } = useDynamicPages(textData);

  // pages[currentPage]만 렌더링
  // (다음/이전 페이지 이동은 상위에서 제어)
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
