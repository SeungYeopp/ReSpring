"use client";

import React from "react";
import { PageProvider } from "./context/PageContext";
import { ViewerSettingsProvider } from "./context/ViewerSettingsContext";
import { TopToolbar } from "./components/Toolbar/TopToolbar";
import { BottomToolbar } from "./components/Toolbar/BottomToolbar";
import { Reader } from "./components/Reader";
import { useViewerSettings } from "./context/ViewerSettingsContext";
import { usePageControls } from "./hooks/usePageControls"; // ✅ 페이지 이동 관련 훅
import { useBookData } from "./hooks/useBookData"; // ✅ API 호출 훅 추가

interface ViewerPageProps {
  params: {
    BookID: string;
  };
}

export default function ViewerPage({ params }: ViewerPageProps) {
  const { BookID } = params;
  const { bookContent, isLoading } = useBookData(BookID); // ✅ API에서 책 데이터 가져오기

  const totalPages = bookContent ? bookContent.split("\n").length : 1; // ✅ 페이지 수 계산 (단순 줄 개수 기준)

  return (
    <PageProvider initialTotalPages={totalPages}>
      <ViewerSettingsProvider>
        <MainLayout BookID={BookID} bookContent={bookContent} isLoading={isLoading} />
      </ViewerSettingsProvider>
    </PageProvider>
  );
}

/** ✅ 메인 레이아웃 */
function MainLayout({ BookID, bookContent, isLoading }: { BookID: string; bookContent: string; isLoading: boolean }) {
  usePageControls();
  const { theme } = useViewerSettings();

  return (
    <main
      className={`h-screen overflow-hidden transition-colors ${
        theme === "basic" ? "bg-white text-black" : theme === "gray" ? "bg-gray-800 text-white" : "bg-black text-white"
      }`}
    >
      {/* ✅ TopToolbar 자체적으로 상태 관리 */}
      <TopToolbar />

      {/* ✅ pt-14 유지 + Reader 높이 보정 */}
      <div className="max-w-5xl mx-auto px-4 pt-14 h-[calc(100vh-56px)] flex flex-col overflow-hidden">
        <div className="text-gray-600 p-4">
          {/* <strong>현재 BookID:</strong> {BookID} */}
        </div>

        {/* ✅ 로딩 처리 */}
        {isLoading ? (
          <p className="text-gray-500 h-full flex items-center justify-center">📖 책 데이터를 불러오는 중...</p>
        ) : (
          <Reader textData={bookContent} /> // ✅ Reader 내부에서도 높이 유지되도록 설정 필요
        )}
      </div>

      {/* ✅ BottomToolbar 자체적으로 상태 관리 */}
      <BottomToolbar bookId={BookID} />
    </main>
  );
}
