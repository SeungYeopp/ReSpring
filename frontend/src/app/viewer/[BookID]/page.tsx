"use client";

/**
툴바 2개(상단 TopToolbar / 하단 BottomToolbar)를 배치.
Reader 컴포넌트를 중앙에 두어 본문(dummyText) 표시.
상단/하단 툴바 높이(약 3rem)를 고려하여 **pt-14 pb-14**를 적용 → 내용이 툴바에 가리지 않도록.
 */


import React from "react";
import { TopToolbar } from "./components/Toolbar/TopToolbar";
import { BottomToolbar } from "./components/Toolbar/BottomToolbar";
import { Reader } from "./components/Reader";

interface ViewerPageProps {
  params: {
    BookID: string;
  };
}

// 가짜 본문
const dummyText = `
  <h1>예시 자서전 제목</h1>
  <p>여기에 자서전 본문이 표시됩니다.</p>
  <p>2단계에서는 최소한의 툴바 + 본문만 구성합니다.</p>
`;

export default function ViewerPage({ params }: ViewerPageProps) {
  const { BookID } = params;

  return (
    <main className="min-h-screen bg-white text-black">
      {/* 상단 툴바 */}
      <TopToolbar />

      {/* 자서전 본문 (Reader) */}
      <div className="pt-14 pb-14"> 
        {/* top toolbar height: 3rem(12px), bottom toolbar height: 3rem(12px) 
            여백(paddingTop/Bottom)으로 컨텐츠가 툴바에 가리지 않도록 */}
        <div className="text-gray-600 p-4">
          <strong>현재 BookID:</strong> {BookID}
        </div>

        <Reader textData={dummyText} />
      </div>

      {/* 하단 툴바 */}
      <BottomToolbar />
    </main>
  );
}
