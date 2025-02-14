"use client";

import React, { useState, useEffect } from "react";
import { useDynamicPages } from "../hooks/useDynamicPages";
import { usePageContext } from "../context/PageContext";
import { useViewerSettings } from "../context/ViewerSettingsContext";
import { Content } from "@/lib/api";
import Image from "next/image";

// interface ReaderProps {
//   textData: string;
//   bookChapters : Chapter[]
//   plainBookContent : string;
// }

interface ReaderProps {
  content: Content;
  imageUrls: string[];
}

//export function Reader({ textData, bookChapters, plainBookContent }: ReaderProps) {
export function Reader({ content, imageUrls }: ReaderProps) {
  const { pages } = useDynamicPages(content, imageUrls);
  const { currentPage, totalPages } = usePageContext();
  const { fontFamily, fontSize, lineHeight, letterSpacing, pageTransition } = useViewerSettings();
  const { highlightKeyword } = usePageContext();

  const [prevPage, setPrevPage] = useState(currentPage);
  const [animationClass, setAnimationClass] = useState("");

  /** ✅ 페이지 내용 강조 로직 추가 */

  const highlightText = (text: string, keyword: string) => {
    const parts = text.split(new RegExp(`(${keyword})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 text-black px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

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
  }, [currentPage, pageTransition, prevPage]);

  return (
    <div className="relative w-full max-w-5xl mx-auto h-full min-h-screen overflow-hidden flex flex-col items-start justify-start">
      {/* ✅ 높이 보장 및 위쪽 정렬 */}

      <div className="text-right text-sm text-gray-500 mb-2">{/* 페이지 {currentPage + 1} / {totalPages} ✅ 현재 페이지 / 전체 페이지 표시 */}</div>

      {/* 📌 실제 페이지 뷰 */}
      {/* 📌 폰트 상태 적용 */}
      <div
        key={currentPage} // 페이지 넘어갈 때 애니메이션 정상 동작하게 하는 key
        className={`relative w-full transition-all duration-300 ease-in-out ${animationClass} ${fontFamily}`}
        style={{ fontSize: `${fontSize}px`, lineHeight, letterSpacing: `${letterSpacing}px` }}
      >
        {/* <Image
          src={imageUrls[currentPage -1]}
          alt={imageUrls[0]}
          width={300}
          height={300}
          className="rounded-md"
        /> */}
        {/* <div>{imageUrls[0]}</div> */}

        {pages[currentPage] ? (
          pages[currentPage].includes("<img") ? (
            // ✅ 이미지 페이지인 경우 (예: <img> 태그가 포함되어 있는 페이지)
            // HTML 그대로 렌더링해야 하므로 dangerouslySetInnerHTML 사용
            <div dangerouslySetInnerHTML={{ __html: pages[currentPage] }} className="h-full flex flex-col items-start justify-start px-4" />
          ) : (
            // ✅ 텍스트 페이지인 경우 (키워드 강조 기능 적용)
            <div className="h-full flex flex-col items-start justify-start px-4">
              {highlightKeyword
                ? highlightText(pages[currentPage], highlightKeyword) // 키워드 있을 때만 강조 표시
                : pages[currentPage]}
            </div>
          )
        ) : (
          // ✅ 현재 페이지가 범위를 벗어났거나, 데이터가 없을 때
          <div className="h-full flex items-center justify-center">해당 페이지가 없습니다.</div>
        )}
      </div>
    </div>
  );
}
