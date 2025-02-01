"use client";

/** 설정 패널 컴포넌트 (위에서 내려오는 UI) */

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

  return (
    <>
      {/* 오버레이 (패널 열릴 때만 보이도록 설정) */}
      <div className={`fixed inset-0 bg-black/40 transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={onClose} />

      {/* 패널 (위에서 내려오는 효과 + 테두리 추가) */}
      <div
        className={`fixed top-0 left-0 w-full p-4 shadow-lg transition-transform rounded-lg border-2 ${theme === "basic" ? "bg-white text-black border-gray-400" : ""} ${
          theme === "gray" ? "bg-gray-800 text-white border-gray-600" : ""
        } ${theme === "dark" ? "bg-black text-white border-gray-800" : ""} ${isOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <h2 className="text-xl font-bold mb-4">설정</h2>

        {/* 테마 설정 */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">테마</label>
          <div className="flex gap-2">
            <button onClick={() => setTheme("basic")} className={`px-3 py-1 rounded border ${theme === "basic" ? "bg-gray-300 text-black" : "bg-transparent"}`}>
              기본
            </button>
            <button onClick={() => setTheme("gray")} className={`px-3 py-1 rounded border ${theme === "gray" ? "bg-gray-600 text-white" : "bg-transparent"}`}>
              그레이
            </button>
            <button onClick={() => setTheme("dark")} className={`px-3 py-1 rounded border ${theme === "dark" ? "bg-gray-900 text-white" : "bg-transparent"}`}>
              다크
            </button>
          </div>
        </div>

        {/* 폰트 크기 설정 */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">글자 크기: {fontSize}px</label>
          <input type="range" min={12} max={32} step={1} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full cursor-pointer" />
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className={`absolute top-2 right-2 px-3 py-1 rounded ${theme === "basic" ? "bg-gray-300 text-black" : ""} ${theme === "gray" ? "bg-gray-600 text-white" : ""} ${
            theme === "dark" ? "bg-gray-800 text-white" : ""
          }`}
        >
          ✕
        </button>
      </div>
    </>
  );
}
