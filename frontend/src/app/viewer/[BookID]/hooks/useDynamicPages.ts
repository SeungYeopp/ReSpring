"use client";

import { useEffect, useState, useRef } from "react";
import { useViewerSettings } from "../context/ViewerSettingsContext";
import { usePageContext } from "../context/PageContext";
import { Content } from "@/lib/api";

interface Chapter {
  title: string;
  page: number;
}

export function useDynamicPages(bookContent: Content) {
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

    const finalPages: string[] = [];
    const finalChapters: Chapter[] = [];
    let currentPage = "";
    let wordCount = 0;
    let pageCount = 0;

    Object.entries(bookContent).forEach(([chapterTitle, content]) => {
      if (currentPage) {
        finalPages.push(currentPage);
        pageCount++;
        currentPage = "";
      }

      finalChapters.push({ title: chapterTitle, page: pageCount });

      currentPage += `<h2 class="chapter-title">${chapterTitle}</h2>`;
      wordCount = currentPage.split(" ").length;

      const words = content.split(" ");
      words.forEach((word) => {
        if (wordCount + 1 <= maxWordsPerPage) {
          if (!currentPage.includes("<p>")) {
            currentPage += "<p>";
          }
          currentPage += " " + word;
          wordCount += 1;
        } else {
          if (currentPage.includes("<p>")) {
            currentPage += "</p>";
          }
          finalPages.push(currentPage);
          pageCount++;
          currentPage = "<p>" + word;
          wordCount = 1;
        }
      });
      
      if (currentPage.includes("<p>")) {
        currentPage += "</p>";
      }
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