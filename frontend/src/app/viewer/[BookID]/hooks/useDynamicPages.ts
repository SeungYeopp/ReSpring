"use client";

import { useEffect, useState, useRef } from "react";
import { useViewerSettings } from "../context/ViewerSettingsContext";
import { usePageContext } from "../context/PageContext";
import { Content } from "@/lib/api";

interface Chapter {
  title: string;
  page: number;
}

interface PageContent {
  title: string;
  body: string[];
}

export function useDynamicPages(bookContent: Content, imageUrls: string[]) {
  const { fontSize, lineHeight, letterSpacing } = useViewerSettings();
  const { setTotalPages } = usePageContext();
  const [pages, setPages] = useState<PageContent[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!bookContent || Object.keys(bookContent).length === 0) return;

    const viewportHeight = containerRef.current?.clientHeight || window.innerHeight;
    const lineHeightPx = fontSize * lineHeight;
    const maxLinesPerPage = Math.floor(viewportHeight / lineHeightPx);
    const wordsPerLine = Math.floor(50 / (fontSize + letterSpacing));
    const maxWordsPerPage = wordsPerLine * maxLinesPerPage;

    const finalPages: PageContent[] = [];
    const finalChapters: Chapter[] = [];
    let currentPage: PageContent | null = null;
    let wordCount = 0;
    let pageCount = 0;

    if (imageUrls.length > 0) {
      imageUrls.forEach((url) => {
        finalPages.push({
          title: "",
          body: [
            `<img
              key={url}
              src={url}
              alt="봄날의 서 이미지"
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />`,
          ],
        });
        pageCount++;
      });
    }

    Object.entries(bookContent).forEach(([chapterTitle, content]) => {
      if (currentPage) {
        finalPages.push(currentPage);
        pageCount++;
        currentPage = null;
      }

      finalChapters.push({ title: chapterTitle, page: pageCount });

      //   제목과 본문을 분리하여 저장
      currentPage = { title: chapterTitle, body: [] };
      wordCount = 0;

      const words = content.split(" ");
      let paragraph: string[] = [];

      words.forEach((word, index) => {
        if (wordCount + 1 <= maxWordsPerPage) {
          paragraph.push(word);
          wordCount += 1;
        } else {
          currentPage!.body.push(paragraph.join(" "));
          paragraph = [word];
          wordCount = 1;
          finalPages.push(currentPage!);
          currentPage = { title: chapterTitle, body: [] };
          pageCount++;
        }
      });

      if (paragraph.length > 0) {
        currentPage!.body.push(paragraph.join(" "));
      }
    });

    if (currentPage) {
      finalPages.push(currentPage);
      pageCount++;
    }

    setPages(finalPages);
    setChapters(finalChapters);
    setTotalPages(pageCount);
  }, [bookContent, imageUrls, fontSize, lineHeight, letterSpacing, setTotalPages]);

  return { pages, chapters, containerRef };
}
