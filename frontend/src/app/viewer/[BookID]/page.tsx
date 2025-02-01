"use client";

import React, { useState } from "react";
import { PageProvider } from "./context/PageContext";
import { ViewerSettingsProvider } from "./context/ViewerSettingsContext";
import { TopToolbar } from "./components/Toolbar/TopToolbar";
import { BottomToolbar } from "./components/Toolbar/BottomToolbar";
import { Reader } from "./components/Reader";
import { SettingsPanel } from "./components/SettingsPannel";
import { useDynamicPages } from "./hooks/useDynamicPages";
import { exampleBookData } from "../mocks/bookData";
import { useViewerSettings } from "./context/ViewerSettingsContext";
import { usePageControls } from "./hooks/usePageControls"; // ✅ 페이지 이동 관련 훅

interface ViewerPageProps {
  params: {
    BookID: string;
  };
}

export default function ViewerPage({ params }: ViewerPageProps) {
  const { BookID } = params;
  const { pages } = useDynamicPages(exampleBookData);
  const totalPages = pages.length;

  // ✅ "설정 패널" 상태 관리
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <PageProvider totalPages={totalPages}>
      <ViewerSettingsProvider>
        {/* ✅ onOpenSettings을 props로 전달 */}
        <MainLayout BookID={BookID} onOpenSettings={() => setSettingsOpen(true)} />

        {/* ✅ SettingsPanel의 상태 연동 */}
        <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </ViewerSettingsProvider>
    </PageProvider>
  );
}

/** ✅ 메인 레이아웃 - 여기서 usePageControls() 호출 */
function MainLayout({ BookID, onOpenSettings }: { BookID: string; onOpenSettings: () => void }) {
  usePageControls();
  const { theme } = useViewerSettings();

  return (
    <main
      className={`min-h-screen transition-colors ${theme === "basic" ? "bg-white text-black" : ""} ${theme === "gray" ? "bg-gray-800 text-white" : ""} ${
        theme === "dark" ? "bg-black text-white" : ""
      }`}
    >
      {/* ✅ TopToolbar에서 onOpenSettings을 props로 받음 */}
      <TopToolbar onOpenSettings={onOpenSettings} />

      <div className="pt-14 pb-14 max-w-3xl mx-auto px-4">
        <div className="text-gray-600 p-4">
          <strong>현재 BookID:</strong> {BookID}
        </div>

        {/* ✅ Reader - 본문 렌더링 */}
        <Reader textData={exampleBookData} />
      </div>

      {/* ✅ 하단 툴바 */}
      <BottomToolbar />
    </main>
  );
}
