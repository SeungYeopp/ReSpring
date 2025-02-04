"use client";

import { usePageContext } from "../../context/PageContext";
import { useViewerSettings } from "../../context/ViewerSettingsContext";
import { TableOfContents } from "../TableOfContents";
import { CommentsPanel } from "../CommentsPanel";
import { TTSPanel } from "../TTSPanel";

interface BottomToolbarProps {
  bookId: string; // ✅ bookId를 props로 받음
}

export function BottomToolbar({ bookId }: BottomToolbarProps) { // ✅ bookId를 props로 받음
  const { currentPage, totalPages } = usePageContext();
  const { theme } = useViewerSettings();

  // ✅ 테마 스타일 지정
  const themeClasses = {
    basic: "bg-white text-black",
    gray: "bg-gray-800 text-white",
    dark: "bg-black text-white",
  };

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 w-full px-4 py-2 flex items-center justify-between shadow-lg z-50 transition-colors ${
          themeClasses[theme as keyof typeof themeClasses]
        }`}
      >
        {/* ✅ TTS 버튼 (왼쪽) */}
        <div className="flex-1 flex justify-start">
          <TTSPanel bookId={bookId} /> {/* ✅ bookId 전달 */}
        </div>

        {/* ✅ 현재 페이지 / 전체 페이지 (가운데) */}
        <div className="flex-1 flex justify-center">
          <span className="text-sm font-semibold">
            {currentPage + 1} / {totalPages}
          </span>
        </div>

        {/* ✅ 댓글 & 목차 버튼 (오른쪽) */}
        <div className="flex-1 flex justify-end gap-2">
          <CommentsPanel />
          <TableOfContents bookId={bookId} /> {/* ✅ bookId 전달 추가 */}
          </div>
      </div>
    </>
  );
}
