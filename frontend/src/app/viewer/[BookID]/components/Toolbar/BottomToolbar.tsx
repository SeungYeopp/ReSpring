"use client";

import React, { useState } from "react";

interface BottomToolbarProps {
  currentPage: number;
  totalPages: number;
}

export function BottomToolbar({ currentPage, totalPages }: BottomToolbarProps) {
  const [localPage, setLocalPage] = useState(currentPage); // 내부 상태로 관리

  const goToPrevPage = () => {
    if (localPage > 0) {
      setLocalPage(localPage - 1);
    }
  };

  const goToNextPage = () => {
    if (localPage < totalPages - 1) {
      setLocalPage(localPage + 1);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-12 px-4 flex items-center justify-between bg-white shadow z-50">
      {/* 이전 페이지 버튼 */}
      <button className="text-sm text-blue-600" onClick={goToPrevPage} disabled={localPage <= 0}>
        이전
      </button>

      {/* 페이지 진행 표시 */}
      <span className="text-xs text-gray-500">
        {localPage + 1} / {totalPages}
      </span>

      {/* 다음 페이지 버튼 */}
      <button
        className="text-sm text-blue-600"
        onClick={goToNextPage}
        disabled={localPage >= totalPages - 1}
      >
        다음
      </button>
    </div>
  );
}
