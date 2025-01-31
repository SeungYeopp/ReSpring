"use client";
/**
 * 2단계: 간단한 하단 툴바 컴포넌트
 * - 프로그레스바, TTS, 댓글, 목차 버튼 정도만 가볍게 배치
 * - 아직 클릭 로직/프로그레스바 구현은 없음
 */
import React from "react";

export function BottomToolbar() {
  return (
    <div className="fixed bottom-0 left-0 w-full h-12 px-4 flex items-center justify-around bg-white shadow z-50">
      {/* 임시 버튼들 */}
      <button className="text-sm text-gray-600">듣기</button>
      <button className="text-sm text-gray-600">댓글</button>
      <button className="text-sm text-gray-600">목차</button>

      {/* 임시 진행 상황 표시(숫자) */}
      <span className="text-xs text-gray-500">0 / 0</span>
    </div>
  );
}
