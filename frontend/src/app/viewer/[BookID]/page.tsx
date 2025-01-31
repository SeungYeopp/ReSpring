"use client";

import React from "react";
import { TopToolbar } from "./components/Toolbar/TopToolbar";
import { BottomToolbar } from "./components/Toolbar/BottomToolbar";
import { Reader } from "./components/Reader";
import { exampleBookData } from "../mocks/bookData";
import { useDynamicPages } from "./hooks/useDynamicPages";
import { usePageControls } from "./hooks/usePageControls"; // 반응형 기능 추가

interface ViewerPageProps {
  params: {
    BookID: string;
  };
}

export default function ViewerPage({ params }: ViewerPageProps) {
  const { BookID } = params;
  const { pages } = useDynamicPages(exampleBookData);
  const totalPages = pages.length;

  // ✅ `usePageControls`에서 상태를 반환받아 직접 사용
  const { currentPage, setCurrentPage } = usePageControls({ totalPages });

  return (
    <main className="min-h-screen bg-white text-black">
      {/* 상단 툴바 */}
      <TopToolbar />

      <div className="pt-14 pb-14 max-w-3xl mx-auto px-4">
        <div className="text-gray-600 p-4">
          <strong>현재 BookID:</strong> {BookID}
        </div>

        {/* Reader 컴포넌트 */}
        <Reader textData={exampleBookData} currentPage={currentPage} />
      </div>

      {/* ✅ Props에서 setCurrentPage 제거, 내부 상태 사용 */}
      <BottomToolbar currentPage={currentPage} totalPages={totalPages} />
    </main>
  );
}
