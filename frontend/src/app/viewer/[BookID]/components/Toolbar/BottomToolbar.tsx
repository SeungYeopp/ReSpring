"use client";

import React from "react";
import { usePageContext } from "../../context/PageContext";
import { useViewerSettings } from "../../context/ViewerSettingsContext"; // ✅ 테마 적용 추가

interface BottomToolbarProps {
  onOpenComments: () => void;
  onOpenTts: () => void;
  onOpenToc: () => void;
}

export function BottomToolbar({ onOpenComments, onOpenTts, onOpenToc }: BottomToolbarProps) {
  const { currentPage, totalPages } = usePageContext(); // ✅ 페이지 상태 가져오기
  const { theme } = useViewerSettings(); // ✅ 테마 가져오기

  return (
    <div
      className={`fixed bottom-0 left-0 w-full h-12 px-4 flex items-center justify-between shadow z-50 transition-colors ${
        theme === "basic" ? "bg-white text-black" : theme === "gray" ? "bg-gray-800 text-white" : "bg-black text-white"
      }`}
    >
      {/* ✅ TTS 버튼 (왼쪽) */}
      <button onClick={onOpenTts} className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors">
        🔊 듣기
      </button>

      {/* ✅ 댓글 버튼 (가운데) */}
      <button onClick={onOpenComments} className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors">
        💬 댓글
      </button>

      {/* ✅ 목차 버튼 (오른쪽) */}
      <button onClick={onOpenToc} className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors">
        📖 목차
      </button>

      {/* ✅ 현재 페이지 / 전체 페이지 */}
      <span className={`absolute bottom-1 right-4 text-xs ${theme === "basic" ? "text-gray-600" : "text-gray-300"}`}>
        {currentPage + 1} / {totalPages}
      </span>
    </div>
  );
}
