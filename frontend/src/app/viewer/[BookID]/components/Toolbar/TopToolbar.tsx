"use client";
/**
 * 2단계: 간단한 상단 툴바 컴포넌트
 * - 뒤로가기, 제목 표시, 설정 버튼 정도만 가볍게 배치
 * - 아직은 클릭 로직 미구현
 */
import React from "react";
import { useRouter } from "next/navigation";
import { useViewerSettings } from "../../context/ViewerSettingsContext";

export function TopToolbar() {
  const router = useRouter();
  const { theme } = useViewerSettings(); // ✅ 테마 가져오기

  return (
    <div className="fixed top-0 left-0 w-full h-12 px-4 flex items-center justify-between bg-white shadow z-50">
      {/* 뒤로가기 버튼 */}
      <button onClick={() => router.back()} className="text-sm text-blue-600">
        &larr; 뒤로
      </button>

      {/* 책 제목 (임시) */}
      <div className="font-bold">책 제목(임시)</div>

      {/* 설정 버튼 (아직 동작은 없음) */}
      <button className="text-sm text-gray-600">설정</button>
    </div>
  );
}
