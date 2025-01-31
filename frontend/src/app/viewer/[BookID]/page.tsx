"use client";
/**
 * 1단계: 기본 레이아웃 & 라우팅 설정
 * - BookID 라우트 파라미터 확인
 * - 간단한 가짜 본문(bookData) 표시
 * - 나중에 Reader, Toolbar, Panel 등을 붙일 예정
 */

import React from "react";

interface ViewerPageProps {
  params: {
    BookID: string; 
  };
}

// 가짜 본문(책 데이터)
const dummyText = `
  <h1>예시 자서전 제목</h1>
  <p>이곳에 자서전 본문이 들어갑니다.</p>
  <p>1단계에서는 최소한의 내용만 표시합니다.</p>
`;

export default function ViewerPage({ params }: ViewerPageProps) {
  const { BookID } = params;

  // 추후 API가 구현되면 실제 책 데이터를 가져올 수도 있음.
  // const bookData = await fetch(`/api/book/${BookID}`).then((res) => res.json());

  return (
    <main className="min-h-screen bg-white text-black p-4">
      {/* BookID 확인 (디버그용) */}
      <div className="mb-4 text-gray-600">
        <strong>현재 BookID:</strong> {BookID}
      </div>

      {/* 간단한 본문 */}
      <section
        className="max-w-2xl mx-auto"
        dangerouslySetInnerHTML={{ __html: dummyText }}
      />

      {/* 
        앞으로 추가할 내용(미구현)
        - Reader 컴포넌트 (페이지 분할, 스와이프 등)
        - TopToolbar, BottomToolbar
        - SettingsPanel, TableOfContents, CommentsPanel, TTSPlayer
      */}
    </main>
  );
}
