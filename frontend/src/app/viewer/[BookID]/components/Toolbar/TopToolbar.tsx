"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useViewerSettings } from "../../context/ViewerSettingsContext";
import { SettingsPanel } from "../SettingsPannel";
import { usePageControls } from "../../hooks/usePageControls";
// PanelContext를 통해 현재 열린 패널의 ID를 가져옵니다.
import { usePanelContext } from "../../context/usePanelContext";

interface ReaderProps {
  title: string;
}

export function TopToolbar({ title }: ReaderProps) {
  const { isToolbarVisible } = usePageControls();
  if (!isToolbarVisible) return null; // 툴바 숨김 상태면 안보이게!

  const router = useRouter();
  const { theme } = useViewerSettings();
  // 전역 패널 상태에서 현재 열린 패널의 ID를 가져옵니다.
  const { currentOpenPanel } = usePanelContext();

  return (
    <>
      <div
        className={`toolbar fixed top-0 left-0 w-full h-12 px-4 flex items-center justify-center shadow z-50 transition-colors ${
          theme === "basic" ? "bg-white text-black" : theme === "gray" ? "bg-gray-800 text-white" : "bg-black text-white"
        }`}
      >
        {/* 뒤로가기 버튼 (왼쪽)
            - 패널이 열려 있다면(currentOpenPanel !== null) 이벤트를 무시하여 페이지 이동하지 않습니다. */}
        <button
          onClick={() => {
            if (currentOpenPanel !== null) return;
            router.back();
          }}
          className="absolute left-4 text-sm text-blue-500"
        >
          &larr; 뒤로
        </button>

        {/* 책 제목 (가운데) */}
        <div className="font-bold text-sm">{title}</div>

        {/* 설정 패널 버튼은 SettingsPanel 컴포넌트 내부에서 자체적으로 상태를 관리합니다. */}
        <SettingsPanel />
      </div>
    </>
  );
}
