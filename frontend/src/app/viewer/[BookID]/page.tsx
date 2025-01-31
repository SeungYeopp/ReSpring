"use client";

import React from "react";
import { TopToolbar } from "./components/Toolbar/TopToolbar";
import { BottomToolbar } from "./components/Toolbar/BottomToolbar";
import { Reader } from "./components/Reader";
import { exampleBookData } from "../mocks/bookData";
import { useDynamicPages } from "./hooks/useDynamicPages";
import { usePageControls } from "./hooks/usePageControls";
import { PageProvider, usePageContext } from "./context/PageContext"; // ✅ Context 추가

interface ViewerPageProps {
  params: {
    BookID: string;
  };
}

export default function ViewerPage({ params }: ViewerPageProps) {
  const { BookID } = params;
  const { pages } = useDynamicPages(exampleBookData);
  const totalPages = pages.length;

  return (
    <PageProvider totalPages={totalPages}> {/* ✅ Context Provider 추가 */}
      <MainContent BookID={BookID} />
    </PageProvider>
  );
}

// ✅ 별도의 컴포넌트로 분리 (usePageControls을 JSX 내부에서 호출하지 않기 위해)
function MainContent({ BookID }: { BookID: string }) {
  usePageControls(); // ✅ JSX 바깥에서 호출 (에러 방지)
  const { currentPage } = usePageContext(); // ✅ 현재 페이지 가져오기

  return (
    <main className="min-h-screen bg-white text-black">
      {/* 상단 툴바 */}
      <TopToolbar />

      <div className="pt-14 pb-14 max-w-3xl mx-auto px-4">
        <div className="text-gray-600 p-4">
          <strong>현재 BookID:</strong> {BookID}
        </div>

        {/* ✅ currentPage을 Reader에 전달 */}
        <Reader textData={exampleBookData} currentPage={currentPage} />
      </div>

      <BottomToolbar />
    </main>
  );
}
