"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useDynamicPages } from "../hooks/useDynamicPages";
import { usePageContext } from "../context/PageContext";
import { useViewerSettings } from "../context/ViewerSettingsContext";
import { Content } from "@/lib/api";

interface ReaderProps {
  content: Content;
  imageUrls: string[];
}

export function Reader({ content, imageUrls }: ReaderProps) {
  const { pages, chapters } = useDynamicPages(content, imageUrls);
  const { currentPage } = usePageContext();
  const { fontFamily, fontSize, lineHeight, letterSpacing, pageTransition } = useViewerSettings();

  /** ✅ 현재 페이지에서 가장 가까운 챕터 찾기 */
  const currentChapter = useMemo(() => {
    if (!chapters.length) return "📖 목차 없음";
    let foundChapter = chapters[0].title;
    for (const chap of chapters) {
      if (chap.page > currentPage) break;
      foundChapter = chap.title;
    }
    return foundChapter;
  }, [currentPage, chapters]);

  /** ✅ 페이지 전환 애니메이션 관련 상태 */
  const [prevPage, setPrevPage] = useState(currentPage);
  const [animationClass, setAnimationClass] = useState("opacity-100");

  useEffect(() => {
    // 페이지 넘김 옵션이 "none"이면 애니메이션 없이 바로 렌더링
    if (pageTransition === "none") {
      setAnimationClass("opacity-100");
      setPrevPage(currentPage);
      return;
    }

    // "fade" 옵션일 경우, 단순 페이드 효과를 적용 (모든 페이지 전환에 대해 동일하게 처리)
    if (currentPage !== prevPage) {
      setAnimationClass("opacity-0");
      const timer = setTimeout(() => {
        setPrevPage(currentPage);
        setAnimationClass("opacity-100");
      }, 150); // 애니메이션 지속 시간 (0.15초)
      return () => clearTimeout(timer);
    }
  }, [currentPage, pageTransition, prevPage]);

  /** ✅ 이미지 URL을 페이지 중간에 삽입 */
  const isImagePage = currentPage < imageUrls.length;
  const currentImageUrl = isImagePage ? imageUrls[currentPage] : null;

  return (
    <div className="relative w-full max-w-5xl mx-auto h-full min-h-screen overflow-hidden flex flex-col items-start justify-start">
      {/* ✅ 현재 페이지의 챕터 제목 표시 */}
      {currentChapter !== "📖 목차 없음" && (
        <div className="w-full text-center text-xl font-bold px-0 p-3 bg-gray-100 text-black dark:bg-gray-800 dark:text-white border-b border-gray-300 dark:border-gray-700 mb-4">
          📖 {currentChapter}
        </div>
      )}

      {/* ✅ 이미지가 포함된 페이지 처리 */}
      {currentImageUrl ? (
        <div className="w-full flex justify-center">
          <img src={currentImageUrl} alt="봄날의 서 이미지" className="max-w-full max-h-screen object-contain" />
        </div>
      ) : (
        <div
          key={currentPage} // key 값을 변경하여 React가 새롭게 렌더링하도록 함
          className={`relative w-full transition-all duration-300 ease-in-out ${animationClass} ${fontFamily} z-0`}
          style={{ fontSize: `${fontSize}px`, lineHeight, letterSpacing: `${letterSpacing}px` }}
        >
          {pages[currentPage]?.body.map((text, i) => (
            <p key={i} className="mb-2">
              {text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
