"use client";
/**
 * 2단계 : 간단히 구현한 Reader 컴포넌트
 * - textData를 받아서 화면에 표시만 해줌
 * - 나중에 페이지 분할, 스와이프 등 기능을 추가할 예정
 */
import React from "react";

interface ReaderProps {
  textData: string;
}

export function Reader({ textData }: ReaderProps) {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div dangerouslySetInnerHTML={{ __html: textData }} />
    </div>
  );
}
