"use client";

import { useState } from "react";
import { useViewerSettings } from "../context/ViewerSettingsContext";
import { usePageContext } from "../context/PageContext";
import { useBookData } from "../hooks/useBookData";
import { useDynamicPages } from "../hooks/useDynamicPages"; // ✅ 페이지 매핑 활용
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { BookOpen } from "lucide-react";

interface Chapter {
  title: string;
  page: number;
}

export function TableOfContents({ bookId }: { bookId: string }) {
  const { theme } = useViewerSettings();
  const { setCurrentPage } = usePageContext();
  const { bookContent } = useBookData(bookId);
  const { pages } = useDynamicPages(bookContent); // ✅ 실제 페이지 정보 활용
  const [isOpen, setIsOpen] = useState(false);
  const [searchType, setSearchType] = useState("chapter");
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ 목차 데이터 (API에서 받아오면 변경 가능)
  const chapters: Chapter[] = [
    { title: "서문", page: 0 },
    { title: "1장 - 시작", page: 5 },
    { title: "2장 - 성장", page: 12 },
    { title: "3장 - 전환점", page: 20 },
    { title: "4장 - 새로운 길", page: 30 },
  ];

  // ✅ 챕터 검색
  const filteredChapters = chapters.filter((chap) =>
    chap.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ 책 내용 검색 (검색어 포함된 페이지 찾기)
  const contentMatches = pages
    .map((pageText, idx) => ({ text: pageText, page: idx })) // ✅ 실제 페이지 매핑
    .filter(({ text }) => text.toLowerCase().includes(searchTerm.toLowerCase()));

  const togglePanel = () => {
    setIsOpen((prev) => !prev);
  };

  const goToChapter = (page: number) => {
    setCurrentPage(page);
    setIsOpen(false);
  };

  return (
    <>
      {/* 목차 패널 버튼 */}
      <Button variant="ghost" size="icon" onClick={togglePanel}>
        <BookOpen className="h-5 w-5" />
      </Button>

      {/* 오버레이 (배경) */}
      {isOpen && <div className="fixed inset-0 bg-black/40 transition-opacity" onClick={togglePanel} />}

      {/* 패널 UI */}
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
        {/* 제목 */}
        <h2 className="text-xl font-bold mb-4">📖 목차 및 검색</h2>

        {/* ✅ 검색 타입 선택 */}
        <Select value={searchType} onValueChange={(value) => setSearchType(value)}>
          <SelectTrigger className="w-full mb-2">
            <SelectValue placeholder="검색 유형 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chapter">📑 챕터 검색</SelectItem>
            <SelectItem value="content">📜 내용 검색</SelectItem>
          </SelectContent>
        </Select>

        {/* ✅ 검색 입력창 */}
        <Input
          type="text"
          placeholder={searchType === "chapter" ? "🔍 챕터 제목 검색..." : "🔍 책 내용 검색..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        {/* ✅ 검색 결과 목록 */}
        <ul className="space-y-2">
          {searchType === "chapter" ? (
            filteredChapters.length > 0 ? (
              filteredChapters.map((chap, idx) => (
                <li
                  key={idx}
                  className="cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => goToChapter(chap.page)}
                >
                  {chap.title}
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm">🔍 검색 결과 없음</p>
            )
          ) : (
            contentMatches.length > 0 ? (
              contentMatches.map((match, idx) => (
                <li
                  key={idx}
                  className="cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => goToChapter(match.page)}
                >
                  <strong>📌 {match.page + 1}페이지:</strong> {match.text.length > 50
                    ? `...${match.text.substring(0, 50)}...`
                    : match.text}
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm">🔍 검색 결과 없음</p>
            )
          )}
        </ul>
      </div>
    </>
  );
}
