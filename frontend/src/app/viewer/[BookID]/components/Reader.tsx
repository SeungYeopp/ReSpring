"use client";

import React, { useMemo } from "react";
import { useDynamicPages } from "../hooks/useDynamicPages";
import { usePageContext } from "../context/PageContext";
import { useViewerSettings } from "../context/ViewerSettingsContext";
import { Content } from "@/lib/api";
import { TableOfContents } from "./TableOfContents";

interface ReaderProps {
  content: Content;
  imageUrls: string[];
}

export function Reader({ content, imageUrls }: ReaderProps) {
  const { pages, chapters } = useDynamicPages(content, imageUrls);
  const { currentPage, totalPages } = usePageContext();
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

  /** ✅ 이미지 URL을 페이지 중간에 삽입 */
  const isImagePage = currentPage < imageUrls.length;
  const currentImageUrl = isImagePage ? imageUrls[currentPage] : null;

  return (
    <div className="relative w-full max-w-5xl mx-auto h-full min-h-screen overflow-hidden flex flex-col items-start justify-start">
      
      {/* ✅ 현재 페이지의 챕터 제목 표시 */}
      <div className="w-full text-center text-xl font-bold px-0 p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 mb-4">
        📖 {currentChapter}
      </div>

      {/* ✅ 이미지가 포함된 페이지 처리 */}
      {currentImageUrl ? (
        <div className="w-full flex justify-center">
          <img 
            src={currentImageUrl} 
            alt="봄날의 서 이미지" 
            className="max-w-full max-h-screen object-contain"
          />
        </div>
      ) : (
        <div 
          key={currentPage} 
          className={`relative w-full ${fontFamily} z-0`} 
          style={{ fontSize: `${fontSize}px`, lineHeight, letterSpacing: `${letterSpacing}px` }}
        >
          {pages[currentPage]?.body.map((text, i) => (
            <p key={i} className="mb-2">{text}</p>
          ))}
        </div>
      )}
    </div>
  );
}