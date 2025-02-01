"use client";

import React, { useState, useEffect } from "react";
import { useDynamicPages } from "../hooks/useDynamicPages";
import { usePageContext } from "../context/PageContext"; // 페이지 이동(현재 페이지) 관련
import { useViewerSettings } from "../context/ViewerSettingsContext"; // 테마/폰트

interface ReaderProps {
  textData: string;
}

export function Reader({ textData }: ReaderProps) {
  const { pages } = useDynamicPages(textData);
  const { currentPage } = usePageContext();
  const { fontSize, lineHeight, letterSpacing, pageTransition } = useViewerSettings();

  const [prevPage, setPrevPage] = useState(currentPage);
  const [animationClass, setAnimationClass] = useState("");

  /** ✅ 페이지 변경 시 애니메이션 적용 */
  useEffect(() => {
    if (currentPage > prevPage) {
      setAnimationClass(pageTransition === "slide" ? "translate-x-full opacity-0" : "opacity-0");
    } else if (currentPage < prevPage) {
      setAnimationClass(pageTransition === "slide" ? "-translate-x-full opacity-0" : "opacity-0");
    }

    setTimeout(() => {
      setPrevPage(currentPage);
      setAnimationClass("translate-x-0 opacity-100");
    }, 150); // 애니메이션 지속 시간 (0.15s)
  }, [currentPage, pageTransition]);

  return (
    <div
      className="relative w-full max-w-3xl mx-auta"
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight,
        letterSpacing: `${letterSpacing}px`,
      }}
    >
      <div
        key={currentPage} // ✅ `key` 값을 변경하여 React가 새롭게 렌더링하도록 함
        className={`absolute inset-0 transition-all duration-300 ease-in-out ${animationClass}`}
      >
        {pages[currentPage] ? <div dangerouslySetInnerHTML={{ __html: pages[currentPage] }} /> : <div>해당 페이지가 없습니다.</div>}
      </div>
    </div>
  );
}
