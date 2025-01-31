"use client";

import React from "react";
import { usePageContext } from "../../context/PageContext";

export function BottomToolbar() {
  const { currentPage, totalPages, setCurrentPage } = usePageContext(); // ✅ Context에서 상태 관리

  return (
    <div className="fixed bottom-0 left-0 w-full h-12 px-4 flex items-center justify-between bg-white shadow z-50">
      <button
        className="text-sm text-blue-600"
        onClick={() => setCurrentPage(-1)} // ✅ `setCurrentPage`를 직접 호출
        disabled={currentPage <= 0}
      >
        이전
      </button>

      <span className="text-xs text-gray-500">
        {currentPage + 1} / {totalPages}
      </span>

      <button
        className="text-sm text-blue-600"
        onClick={() => setCurrentPage(1)} // ✅ `setCurrentPage`를 직접 호출
        disabled={currentPage >= totalPages - 1}
      >
        다음
      </button>
    </div>
  );
}
