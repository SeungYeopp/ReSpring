"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useViewerSettings } from "../../context/ViewerSettingsContext";
import { SettingsPanel } from "../SettingsPannel";

export function TopToolbar() {
  const router = useRouter();
  const { theme } = useViewerSettings();

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-12 px-4 flex items-center justify-center shadow z-50 transition-colors ${
          theme === "basic" ? "bg-white text-black" : theme === "gray" ? "bg-gray-800 text-white" : "bg-black text-white"
        }`}
      >
        {/* 뒤로가기 버튼 (왼쪽) */}
        <button onClick={() => router.back()} className="absolute left-4 text-sm text-blue-500">
          &larr; 뒤로
        </button>

        {/* 책 제목 (가운데) */}
        <div className="font-bold text-sm">책 제목 (임시)</div>

        {/* ✅ 설정 패널 자체에서 버튼을 포함하고 상태 관리 */}
        <SettingsPanel />
      </div>
    </>
  );
}
