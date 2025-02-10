// layout.tsx
"use client";

import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // 전체 레이아웃을 flex container로 설정
    // min-h-screen으로 최소한 전체 화면 높이를 차지하도록 설정
    <div className="">
      {/* 메인 콘텐츠 영역 */}
      <main className=" ">{children}</main>
    </div>
  );
}
