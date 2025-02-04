"use client";

import { useEffect, useState, useRef } from "react";
import { useViewerSettings } from "../context/ViewerSettingsContext";
import { usePageContext } from "../context/PageContext"; // ✅ totalPages 업데이트 반영

/**
 * ✅ 화면 크기와 폰트 설정을 고려하여 텍스트를 동적으로 페이지 단위로 분할
 * - 실제 컨테이너 높이와 폰트 크기 기반으로 한 페이지에 표시할 줄 수 계산
 * - 단어 단위로 끊어서 페이지를 나눔
 */

export function useDynamicPages(textData: string) {
  const { fontSize, lineHeight, letterSpacing } = useViewerSettings();
  const { setTotalPages } = usePageContext(); // ✅ totalPages 업데이트
  const [pages, setPages] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!textData) return;

    // ✅ 실제 컨테이너 높이 가져오기 (뷰포트 높이 대신)
    const viewportHeight = containerRef.current?.clientHeight || window.innerHeight;
    const lineHeightPx = fontSize * lineHeight;
    const maxLinesPerPage = Math.floor(viewportHeight / lineHeightPx); // 한 페이지에 들어갈 최대 줄 수

    console.log(`📌 한 페이지당 최대 줄 수: ${maxLinesPerPage}`);

    // ✅ 문단을 단어 단위로 나누기
    const words = textData.split(/\s+/); // 공백 기준으로 단어 나누기
    const wordsPerLine = Math.floor(50 / (fontSize + letterSpacing)); // ✅ 글자 수 반영한 1줄당 단어 수 계산
    const maxWordsPerPage = wordsPerLine * maxLinesPerPage; // ✅ 한 페이지당 최대 단어 수

    const finalPages: string[] = [];
    let currentPage = "";
    let wordCount = 0;

    words.forEach((word) => {
      if (wordCount + 1 <= maxWordsPerPage) {
        // ✅ 현재 페이지에 추가 가능하면 추가
        currentPage += (currentPage ? " " : "") + word;
        wordCount += 1;
      } else {
        // ✅ 페이지가 꽉 차면 저장 후 새로운 페이지 시작
        finalPages.push(currentPage);
        currentPage = word;
        wordCount = 1;
      }
    });

    if (currentPage) finalPages.push(currentPage);

    setPages(finalPages);
    setTotalPages(finalPages.length); // ✅ totalPages 업데이트
  }, [textData, fontSize, lineHeight, letterSpacing, setTotalPages]); // ✅ 설정 변경 시 재계산

  return { pages, containerRef };
}