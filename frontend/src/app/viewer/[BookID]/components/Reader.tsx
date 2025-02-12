"use client";

import React, { useState, useEffect } from "react";
import { useDynamicPages } from "../hooks/useDynamicPages";
import { usePageContext } from "../context/PageContext";
import { useViewerSettings } from "../context/ViewerSettingsContext";
import { Content } from "@/lib/api";

// interface ReaderProps {
//   textData: string;
//   bookChapters : Chapter[]
//   plainBookContent : string;
// }

interface ReaderProps {
  content: Content;
}

//export function Reader({ textData, bookChapters, plainBookContent }: ReaderProps) {
export function Reader({ content }: ReaderProps) {
  const { pages } = useDynamicPages(content);
  const { currentPage, totalPages } = usePageContext();
  const { fontSize, lineHeight, letterSpacing, pageTransition } = useViewerSettings();

  const [prevPage, setPrevPage] = useState(currentPage);
  const [animationClass, setAnimationClass] = useState("");

  /** ✅ 페이지 변경 시 애니메이션 적용 */
  useEffect(() => {
    if (pageTransition === "slide") {
      if (currentPage > prevPage) {
        setAnimationClass("translate-x-full opacity-0");
      } else if (currentPage < prevPage) {
        setAnimationClass("-translate-x-full opacity-0");
      }
    } else if (pageTransition === "fade") {
      setAnimationClass("opacity-0");
    }

    setTimeout(() => {
      setPrevPage(currentPage);
      setAnimationClass("translate-x-0 opacity-100");
    }, 150); // 애니메이션 지속 시간 (0.15s)
  }, [currentPage, pageTransition]);

  return (
    <div className="relative w-full max-w-5xl mx-auto h-full min-h-screen overflow-hidden flex flex-col items-start justify-start"> 
      {/* ✅ 높이 보장 및 위쪽 정렬 */}

      <div className="text-right text-sm text-gray-500 mb-2">
        {/* 페이지 {currentPage + 1} / {totalPages} ✅ 현재 페이지 / 전체 페이지 표시 */}
      </div>

      {/* 📌 실제 페이지 뷰 */}
      <div
        key={currentPage} // ✅ `key` 변경하여 React가 새롭게 렌더링하도록 함
        className={`relative w-full transition-all duration-300 ease-in-out ${animationClass}`} // ✅ absolute → relative 변경
        style={{ fontSize: `${fontSize}px`, lineHeight, letterSpacing: `${letterSpacing}px` }}
      >
        {pages[currentPage] ? (
          <div 
            dangerouslySetInnerHTML={{ __html: pages[currentPage] }} 
            className="h-full flex flex-col items-start justify-start px-4" 
            // ✅ 높이를 보장하고, 텍스트를 상단에서 시작하도록 `flex-col items-start` 적용
          /> 
        ) : (
          <div className="h-full flex items-center justify-center">해당 페이지가 없습니다.</div>
        )}
      </div>
    </div>
  );
}
