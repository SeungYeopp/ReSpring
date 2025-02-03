"use client";

import React, { useState } from "react";
import { PageProvider } from "./context/PageContext";
import { ViewerSettingsProvider } from "./context/ViewerSettingsContext";
import { TopToolbar } from "./components/Toolbar/TopToolbar";
import { BottomToolbar } from "./components/Toolbar/BottomToolbar";
import { Reader } from "./components/Reader";
import { SettingsPanel } from "./components/SettingsPannel";
import { TableOfContents } from "./components/TableOfContents";
import { CommentsPanel } from "./components/CommentsPanel";
import { TTSPanel } from "./components/TTSPanel";
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

  // ✅ "설정 패널", "목차", "댓글", "TTS" 상태 관리
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [ttsOpen, setTtsOpen] = useState(false);

  return (
    <PageProvider totalPages={totalPages}>
      <ViewerSettingsProvider>
        {/* ✅ onOpenXxxx() props 전달 */}
        <MainLayout
          BookID={BookID}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenToc={() => setTocOpen(true)}
          onOpenComments={() => setCommentsOpen(true)}
          onOpenTts={() => setTtsOpen(true)}
        />

        {/* ✅ 패널들 적용 */}
        <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <TableOfContents isOpen={tocOpen} onClose={() => setTocOpen(false)} chapters={getExampleChapters()} />
        <CommentsPanel isOpen={commentsOpen} onClose={() => setCommentsOpen(false)} />
        <TTSPanel isOpen={ttsOpen} onClose={() => setTtsOpen(false)} />
      </ViewerSettingsProvider>
    </PageProvider>
  );
}

/** ✅ 메인 레이아웃 */
function MainLayout({
  BookID,
  onOpenSettings,
  onOpenToc,
  onOpenComments,
  onOpenTts,
}: {
  BookID: string;
  onOpenSettings: () => void;
  onOpenToc: () => void;
  onOpenComments: () => void;
  onOpenTts: () => void;
}) {
  usePageControls();
  const { theme } = useViewerSettings();

  return (
    <main
      className={`min-h-screen transition-colors ${
        theme === "basic" ? "bg-white text-black" : theme === "gray" ? "bg-gray-800 text-white" : "bg-black text-white"
      }`}
    >
      {/* ✅ TopToolbar에서 onOpenSettings만 전달 */}
      <TopToolbar onOpenSettings={onOpenSettings} />

      <div className="pt-14 pb-14 max-w-3xl mx-auto px-4">
        <div className="text-gray-600 p-4">
          <strong>현재 BookID:</strong> {BookID}
        </div>

        {/* ✅ Reader - 본문 렌더링 */}
        <Reader textData={exampleBookData} />
      </div>

      {/* ✅ BottomToolbar에서 댓글/음성/목차 패널 열기 */}
      <BottomToolbar 
        onOpenComments={onOpenComments} 
        onOpenTts={onOpenTts} 
        onOpenToc={onOpenToc} 
      />
    </main>
  );
}

/** ✅ 예제 목차 데이터 (실제 데이터 연동 시 API에서 가져오도록 변경 가능) */
function getExampleChapters() {
  return [
    { title: "서문", page: 0 },
    { title: "1장 - 시작", page: 5 },
    { title: "2장 - 성장", page: 12 },
    { title: "3장 - 전환점", page: 20 },
    { title: "4장 - 새로운 길", page: 30 },
  ];
}
