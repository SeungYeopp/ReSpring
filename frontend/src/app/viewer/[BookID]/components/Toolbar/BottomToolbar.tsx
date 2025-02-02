"use client";

import React from "react";
import { usePageContext } from "../../context/PageContext";
import { useViewerSettings } from "../../context/ViewerSettingsContext"; // ✅ 테마 적용 추가

export function BottomToolbar() {
  const { currentPage, totalPages, setCurrentPage } = usePageContext(); // ✅ 페이지 상태 가져오기
  const { theme } = useViewerSettings(); // ✅ 테마 가져오기

  return (
    <div
      className={`fixed bottom-0 left-0 w-full h-12 px-4 flex items-center justify-between shadow z-50 transition-colors ${theme === "basic" ? "bg-white text-black" : ""} ${
        theme === "gray" ? "bg-gray-800 text-white" : ""
      } ${theme === "dark" ? "bg-black text-white" : ""}`}
    >
      {/* 이전 페이지 버튼 */}
      <button className={`text-sm ${currentPage <= 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-500"}`} onClick={() => setCurrentPage(-1)} disabled={currentPage <= 0}>
        이전
      </button>

      {/* 현재 페이지 / 전체 페이지 */}
      <span className={`text-xs ${theme === "basic" ? "text-gray-600" : "text-gray-300"}`}>
        {currentPage + 1} / {totalPages}
      </span>

      {/* 다음 페이지 버튼 */}
      <button className={`text-sm ${currentPage >= totalPages - 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-500"}`} onClick={() => setCurrentPage(1)} disabled={currentPage >= totalPages - 1}>
        다음
      </button>
    </div>
  );
}
