"use client";

import type React from "react";

export default function TodayLayout({ children }: { children: React.ReactNode }) {
  return (
    // 전체 레이아웃을 flex container로 설정
    // min-h-screen으로 최소한 전체 화면 높이를 차지하도록 설정
    <div className="min-h-screen flex flex-col ">
      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  );
}
