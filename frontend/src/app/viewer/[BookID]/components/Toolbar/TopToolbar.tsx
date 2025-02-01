"use client";
/**
 * 2단계: 상단 툴바 컴포넌트 개선
 * - 뒤로가기 버튼, 책 제목, 설정 버튼 포함
 * - 테마 적용 (기본, 그레이, 다크)
 * - 설정 버튼 클릭 시 패널 열림
 */
import React from "react";
import { useRouter } from "next/navigation";
import { useViewerSettings } from "../../context/ViewerSettingsContext";

interface TopToolbarProps {
  onOpenSettings: () => void; // ✅ 설정 버튼 클릭 시 실행될 함수
}

export function TopToolbar({ onOpenSettings }: TopToolbarProps) {
  const router = useRouter();
  const { theme } = useViewerSettings(); // ✅ 테마 가져오기

  return (
    <div
      className={`fixed top-0 left-0 w-full h-12 px-4 flex items-center justify-between shadow z-50 transition-colors ${theme === "basic" ? "bg-white text-black" : ""} ${
        theme === "gray" ? "bg-gray-800 text-white" : ""
      } ${theme === "dark" ? "bg-black text-white" : ""}`}
    >
      {/* 뒤로가기 버튼 */}
      <button onClick={() => router.back()} className="text-sm text-blue-500">
        &larr; 뒤로
      </button>

      {/* 책 제목 (임시) */}
      <div className="font-bold text-sm">책 제목 (임시)</div>

      {/* 설정 버튼 (패널 열기) */}
      <button
        onClick={onOpenSettings} // ✅ 설정 버튼 클릭 시 실행
        className="text-sm text-gray-400 hover:text-gray-600"
      >
        ⚙ 설정
      </button>
    </div>
  );
}
