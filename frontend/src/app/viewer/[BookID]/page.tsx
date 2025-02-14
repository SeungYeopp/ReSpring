"use client";

import React, { useEffect } from "react";
import { PageProvider } from "./context/PageContext";
import { ViewerSettingsProvider } from "./context/ViewerSettingsContext";
import { TopToolbar } from "./components/Toolbar/TopToolbar";
import { BottomToolbar } from "./components/Toolbar/BottomToolbar";
import { Reader } from "./components/Reader";
import { useViewerSettings } from "./context/ViewerSettingsContext";
import { usePageControls } from "./hooks/usePageControls"; // ✅ 페이지 이동 관련 훅
import { useBookData } from "./hooks/useBookData"; // ✅ API 호출 훅 추가
import { Content } from "@/lib/api";
import LoadingScreen from "@/components/custom/LoadingScreen";
interface ViewerPageProps {
  params: {
    BookID: string;
  };
}

export default function ViewerPage({ params }: ViewerPageProps) {
  const { BookID } = params;

  //아래 내용 수정 필요.
  //const { bookContent, isLoading, bookTitle, bookChapters, plainBookContent } = useBookData(BookID); // ✅ API에서 책 데이터 가져오기
  const { bookContent, isLoading, bookTitle, imageUrls } = useBookData(BookID); // ✅ API에서 책 데이터 가져오기
  //const totalPages = bookContent ? bookContent.split("\n").length : 1; // ✅ 페이지 수 계산 (단순 줄 개수 기준)
  const totalPages = 100;

  const defaultContent = { "임시 챕터 이름": "임시 챕터 내용" };
  const defaultTitle = "임시 봄날의 서 제목";

  return (
    <PageProvider initialTotalPages={totalPages}>
      <ViewerSettingsProvider>
        <MainLayout BookID={BookID} bookContent={bookContent ?? defaultContent} isLoading={isLoading} BookTitle={bookTitle ?? defaultTitle} imageUrls={imageUrls ?? []} />
        {/* <MainLayout BookID={BookID} bookContent={bookContent} isLoading={isLoading} BookTitle={bookTitle!} BookChapters={bookChapters!} plainBookContent={plainBookContent!}/> */}
      </ViewerSettingsProvider>
    </PageProvider>
  );
}

/** ✅ 메인 레이아웃 */
//function MainLayout({ BookID, bookContent, isLoading, BookTitle, BookChapters, plainBookContent }: { BookID: string; bookContent: string; isLoading: boolean, BookTitle : string, BookChapters : Chapter[], plainBookContent : string }) {
function MainLayout({ BookID, bookContent, isLoading, BookTitle, imageUrls }: { BookID: string; bookContent: Content; isLoading: boolean; BookTitle: string; imageUrls: string[] }) {
  usePageControls();
  const { theme } = useViewerSettings();

  return (
    <main className={`md:-ml-64 h-screen overflow-hidden transition-colors ${theme === "basic" ? "bg-white text-black" : theme === "gray" ? "bg-gray-800 text-white" : "bg-black text-white"}`}>
      {/* ✅ TopToolbar 자체적으로 상태 관리 */}
      <TopToolbar title={BookTitle} />

      {/* ✅ pt-14 유지 + Reader 높이 보정 */}
      <div className="max-w-5xl mx-auto px-4 pt-14 h-[calc(100vh-56px)] flex flex-col overflow-hidden">
        <div className="text-gray-600 p-4">{/* <strong>현재 BookID:</strong> {BookID} */}</div>

        {/* ✅ 로딩 처리 */}
        {isLoading ? (
          <p className="text-gray-500 h-full flex items-center justify-center">📖 책 데이터를 불러오는 중...</p>
        ) : (
          <Reader content={bookContent} imageUrls={imageUrls} /> // ✅ Reader 내부에서도 높이 유지되도록 설정 필요
          // <Reader textData={bookContent} bookChapters={BookChapters} plainBookContent = {plainBookContent}/> // ✅ Reader 내부에서도 높이 유지되도록 설정 필요
        )}
      </div>

      {/* ✅ BottomToolbar 자체적으로 상태 관리 */}
      <BottomToolbar bookId={BookID} imageUrls={imageUrls} />
    </main>
  );
}
