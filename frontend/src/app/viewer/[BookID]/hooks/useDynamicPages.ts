"use client";
/**
 * 3단계: 페이지 분할 로직 
 * (실제 자서전 데이터가 태그 없이 일반 텍스트로 들어온다고 가정)
 * - 텍스트를 문단 단위로 나눠 'pages' 배열을 생성.
 * - HTML 태그가 없는 일반 텍스트를 처리하도록
 */
import { useMemo } from "react";

/**
 * textData: 일반 텍스트 문자열
 * returns { pages } : string[] - 페이지별 텍스트
 */
export function useDynamicPages(textData: string) {
  const pages = useMemo(() => {
    // 1) 두 개 이상의 줄바꿈 (\n\n) 기준으로 문단을 분리
    const rawParagraphs = textData
      .split(/\n\s*\n/) // 빈 줄을 포함한 문단 나누기
      .map((str) => str.trim()) // 앞뒤 공백 제거
      .filter((str) => str.length > 0); // 빈 문단 제거

    return rawParagraphs;
  }, [textData]);

  return { pages };
}
