"use client";

import React, { useState } from "react";
import { PageProvider } from "./context/PageContext"; // (이미 1~3단계에서 만든) 페이지 이동 컨텍스트
import { ViewerSettingsProvider } from "./context/ViewerSettingsContext";
import { TopToolbar } from "./components/Toolbar/TopToolbar";
import { BottomToolbar } from "./components/Toolbar/BottomToolbar";
import { Reader } from "./components/Reader";
import { SettingsPanel } from "./components/SettingsPannel";
import { useDynamicPages } from "./hooks/useDynamicPages";
import { exampleBookData } from "../mocks/bookData";
import { useViewerSettings } from "./context/ViewerSettingsContext";
import { usePageControls } from "./hooks/usePageControls"; // ✅ 위치 이동

interface ViewerPageProps {
  params: {
    BookID: string;
  };
}

export default function ViewerPage({ params }: ViewerPageProps) {
  const { BookID } = params;
  const { pages } = useDynamicPages(exampleBookData);
  const totalPages = pages.length;

  // "설정 패널" 열림 상태
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <PageProvider totalPages={totalPages}>
      {" "}
      {/* ✅ PageProvider 내부에서 실행되도록 수정 */}
      <ViewerSettingsProvider>
        <MainLayout BookID={BookID} onOpenSettings={() => setSettingsOpen(true)} />
        {/* 설정 패널 */}
        <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </ViewerSettingsProvider>
    </PageProvider>
  );
}

/** 메인 레이아웃 - 여기서 usePageControls() 호출 */
function MainLayout({ BookID, onOpenSettings }: { BookID: string; onOpenSettings: () => void }) {
  // ✅ usePageControls()를 PageProvider 내부에서 실행
  usePageControls();

  const { theme } = useViewerSettings();

  return (
    <main
      className={`min-h-screen transition-colors ${theme === "basic" ? "bg-white text-black" : ""} ${theme === "gray" ? "bg-gray-800 text-white" : ""} ${
        theme === "dark" ? "bg-black text-white" : ""
      }`}
    >
      {/* 상단 툴바 */}
      <TopToolbar />
      <button onClick={onOpenSettings} className="absolute top-14 right-4 bg-blue-500 text-white px-3 py-1 rounded">
        설정 열기
      </button>

      <div className="pt-14 pb-14 max-w-3xl mx-auto px-4">
        <div className="text-gray-600 p-4">
          <strong>현재 BookID:</strong> {BookID}
        </div>

        {/* Reader */}
        <Reader textData={exampleBookData} />
      </div>

      {/* 하단 툴바 */}
      <BottomToolbar />
    </main>
  );
}
