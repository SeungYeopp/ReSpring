"use client";

import React, { useMemo } from "react";
import { usePageContext } from "../../context/PageContext";
import { useDynamicPages } from "../../hooks/useDynamicPages";
import { useViewerSettings } from "../../context/ViewerSettingsContext";
import { TableOfContents } from "../TableOfContents";
import { CommentsPanel } from "../CommentsPanel";
import { TTSPanel } from "../TTSPanel";
import { Chapter } from "@/lib/api";
import { usePageControls } from "../../hooks/usePageControls";
import { Content } from "@/lib/api";

interface BottomToolbarProps {
  bookId: string; // ✅ bookId를 props로 받음
  content: Content;
  imageUrls: string[];
}

export function BottomToolbar({ bookId, content, imageUrls }: BottomToolbarProps) {
  const { isToolbarVisible } = usePageControls();

  // ✅ bookId를 props로 받음
  const { currentPage, totalPages } = usePageContext();
  const { theme } = useViewerSettings();

  // ✅ 테마 스타일 지정
  const themeClasses = {
    basic: "bg-white text-black",
    gray: "bg-gray-800 text-white",
    dark: "bg-black text-white",
  };

  const { pages, chapters } = useDynamicPages(content, imageUrls);
  const { fontFamily, fontSize, lineHeight, letterSpacing } = useViewerSettings();

  /** ✅ 현재 페이지에서 가장 가까운 챕터 찾기 */
  const currentChapter = useMemo(() => {
    if (!chapters.length) return "📖 목차 없음"; // 챕터가 없을 경우 기본값

    let foundChapter = chapters[0].title; // 기본값은 첫 번째 챕터
    for (const chap of chapters) {
      if (chap.page > currentPage) break; // 현재 페이지보다 큰 챕터가 나오면 이전 챕터를 유지
      foundChapter = chap.title;
    }
    return foundChapter;
  }, [currentPage, chapters]);

    // ✅ `isToolbarVisible` 체크
    if (!isToolbarVisible) return <></>;

  return (
    <>
      <div className={`fixed bottom-0 left-0 w-full px-4 py-2 flex items-center justify-between shadow-lg z-50 transition-colors ${themeClasses[theme as keyof typeof themeClasses]}`}>
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
          <TableOfContents pages={pages} chapters={chapters} />
        </div>
      </div>
    </>
  );
}
