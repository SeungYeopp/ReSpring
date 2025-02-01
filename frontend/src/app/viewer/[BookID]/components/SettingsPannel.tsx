"use client";

/** 설정 패널 컴포넌트! */

import React from "react";
import { useViewerSettings } from "../context/ViewerSettingsContext";

interface SettingsPanelProps {
  /** 패널이 열려있는지 여부 */
  isOpen: boolean;
  /** 닫기 콜백 */
  onClose: () => void;
}

/** 테마 & 폰트 크기 설정 패널 */
export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { theme, setTheme, fontSize, setFontSize } = useViewerSettings();

  if (!isOpen) return null; // 열려 있지 않으면 렌더링 안함

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* 패널 본체 */}
      <div className="bg-white p-4 rounded shadow w-[300px] relative">
        <h2 className="text-xl font-bold mb-4">Settings</h2>

        {/* 테마 설정 */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Theme</label>
          <div className="flex gap-2">
            {/* Basic */}
            <button onClick={() => setTheme("basic")} className={`px-3 py-1 rounded border ${theme === "basic" ? "bg-gray-200" : ""}`}>
              Basic
            </button>
            {/* Gray */}
            <button onClick={() => setTheme("gray")} className={`px-3 py-1 rounded border ${theme === "gray" ? "bg-gray-200" : ""}`}>
              Gray
            </button>
            {/* Dark */}
            <button onClick={() => setTheme("dark")} className={`px-3 py-1 rounded border ${theme === "dark" ? "bg-gray-200" : ""}`}>
              Dark
            </button>
          </div>
        </div>

        {/* 폰트 크기 설정 */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Font Size: {fontSize}px</label>
          <input type="range" min={12} max={32} step={1} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} />
        </div>

        {/* 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-2 right-2 px-2 py-1 bg-gray-300 rounded">
          ✕
        </button>
      </div>
    </div>
  );
}
