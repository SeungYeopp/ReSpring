"use client";

import React from "react";
import { useViewerSettings } from "../context/ViewerSettingsContext";
import { usePageContext } from "../context/PageContext";

/** 각 챕터 정보: title + page번호 */
interface Chapter {
  title: string;
  page: number;
}

/** 목차 패널 Props */
interface TableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
}

/** 목차 패널: 우측에서 70% 슬라이드 아웃 */
export function TableOfContents({ isOpen, onClose, chapters }: TableOfContentsProps) {
  const { theme } = useViewerSettings();
  const { setCurrentPage } = usePageContext(); // 페이지 이동

  const goToChapter = (page: number) => {
    setCurrentPage(page);
    onClose(); // 패널 닫기
  };

  return (
    <>
      {/* 오버레이 (배경) */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />
      {/* 패널 본체 (우측 슬라이드 아웃) */}
      <div
        className={`fixed top-0 right-0 h-full w-[70%] p-4 transition-transform duration-300 ease-in-out border-2 rounded-l-lg
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          ${
            theme === "basic"
              ? "bg-white text-black border-gray-400"
              : theme === "gray"
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-black text-white border-gray-800"
          }`}
      >
        <h2 className="text-xl font-bold mb-4">목차</h2>
        <ul className="space-y-2">
          {chapters.map((chap, idx) => (
            <li
              key={idx}
              className="cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => goToChapter(chap.page)}
            >
              {chap.title}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
