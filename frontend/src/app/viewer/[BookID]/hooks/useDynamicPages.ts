"use client";

import { useEffect, useState, useRef } from "react";
import { useViewerSettings } from "../context/ViewerSettingsContext";
import { usePageContext } from "../context/PageContext";
import { Content } from "@/lib/api";

interface Chapter {
  title: string;
  page: number;
}

export function useDynamicPages(bookContent: Content, imageUrls: string[]) {
  const { fontSize, lineHeight, letterSpacing } = useViewerSettings();
  const { setTotalPages } = usePageContext();
  const [pages, setPages] = useState<string[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!bookContent || Object.keys(bookContent).length === 0) return;

    
    const viewportHeight = containerRef.current?.clientHeight || window.innerHeight;
    const lineHeightPx = fontSize * lineHeight;
    const maxLinesPerPage = Math.floor(viewportHeight / lineHeightPx);
    console.log(`📌 한 페이지당 최대 줄 수: ${maxLinesPerPage}`);

    const wordsPerLine = Math.floor(50 / (fontSize + letterSpacing));
    const maxWordsPerPage = wordsPerLine * maxLinesPerPage;
    console.log(`📌 한 페이지당 최대 단어 수: ${maxWordsPerPage}`);

    const finalPages: string[] = [];
    const finalChapters: Chapter[] = [];
    let currentPage = "";
    let wordCount = 0;
    let pageCount = 0;

    
    // if(imageUrls)
    //   imageUrls!.forEach((url, idx) => {
    //     console.log("idx", idx)
    //     finalPages.push("");
    //     pageCount++;
    //   })

    console.log(pageCount)

    Object.entries(bookContent).forEach(([chapterTitle, content]) => {
      if (currentPage) {
        finalPages.push(currentPage);
        pageCount++;
        currentPage = "";
      }

      finalChapters.push({ title: chapterTitle, page: pageCount });

      // 챕터 제목 추가
      currentPage += `📖 ${chapterTitle}`;
      wordCount = currentPage.split(" ").length; // 단어 수 업데이트

      // 챕터 본문 내용 처리
      const words = content.split(" ");
      words.forEach((word) => {
        if (wordCount + 1 <= maxWordsPerPage) {
          currentPage += " " + word;
          wordCount += 1;
        } else {
          // 페이지가 꽉 차면 새로운 페이지로 넘어감
          finalPages.push(currentPage);
          currentPage = word;
          wordCount = 1;
          pageCount++;
        }
      });
    });

    if (currentPage) {
      finalPages.push(currentPage);
      pageCount++;
    }

    setPages(finalPages);
    setChapters(finalChapters);
    setTotalPages(pageCount);
  }, [bookContent, fontSize, lineHeight, letterSpacing, setTotalPages]);

  
  return { pages, chapters, containerRef };
}