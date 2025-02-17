"use client";

import { useState, useMemo } from "react";
import { useViewerSettings } from "../context/ViewerSettingsContext";
import { usePageContext } from "../context/PageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

interface TableOfContentsProps {
  pages: { body: string[] }[];
  chapters?: { title: string; page: number }[];
}

interface ContentMatch {
  text: string;
  page: number;
}

export function TableOfContents({ pages, chapters = [] }: TableOfContentsProps) {
  const { theme } = useViewerSettings();
  const { setCurrentPage, setHighlightKeyword } = usePageContext();

  const [isOpen, setIsOpen] = useState(false);
  const [searchType, setSearchType] = useState("chapter"); // ✅ 검색 유형 상태 추가
  const [searchTerm, setSearchTerm] = useState("");
  const [currentListPage, setCurrentListPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  // ✅ 챕터 검색
  const filteredChapters = useMemo(() => 
    chapters?.filter((chap) => chap.title.toLowerCase().includes(searchTerm.toLowerCase())) || [], 
    [chapters, searchTerm]
  );

  // ✅ 내용 검색
  const contentMatches = useMemo(() => 
    pages.flatMap((page, idx) => 
      page.body.map((bodyText) => ({ text: bodyText, page: idx }))
    ).filter(({ text }) => text.toLowerCase().includes(searchTerm.toLowerCase())),
    [pages, searchTerm]
  );

  // ✅ 패널 열고 닫기
  const togglePanel = () => {
    setIsOpen((prev) => {
      if (prev) setHighlightKeyword(null); // 패널 닫힐 때 강조 해제
      return !prev;
    });
  };

  // ✅ 페이지 이동 및 키워드 강조
  const goToPage = (targetPage: number, keyword?: string) => {
    setCurrentPage(targetPage);
    setHighlightKeyword(keyword || null);
    setIsOpen(false);
  };

  // ✅ 현재 페이지네이션 설정
  const totalItems = searchType === "chapter" ? filteredChapters.length : contentMatches.length;
  const totalListPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentListPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedItems = searchType === "chapter" 
    ? filteredChapters.slice(startIndex, endIndex) 
    : contentMatches.slice(startIndex, endIndex);

  // ✅ 검색어 강조 표시
  const highlightSearchTerm = (text: string) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 text-black px-1 rounded">{part}</mark>
      ) : (
        part
      )
    );
  };

  // ✅ 검색 결과 미리보기 (내용 검색용)
  const getContentPreview = (text: string, maxLength = 100) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const index = text.toLowerCase().indexOf(lowerSearchTerm);
    if (index === -1) return text.slice(0, maxLength);

    const start = Math.max(0, index - 20);
    const end = Math.min(text.length, index + searchTerm.length + 20);
    let preview = text.slice(start, end);

    if (start > 0) preview = "..." + preview;
    if (end < text.length) preview = preview + "...";

    return preview;
  };

  return (
    <>
      {/* ✅ 오른쪽 아래 목차 버튼 */}
      <Button variant="ghost" size="icon" onClick={togglePanel}>
        <BookOpen className="h-6 w-6" />
      </Button>

      {/* ✅ 오버레이 (배경을 어둡게 하고 패널이 뷰어 위로 올라오도록 처리) */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={togglePanel} />}

      {/* ✅ 오른쪽에서 슬라이드되는 목차 패널 */}
      <div
        className={`fixed top-0 right-0 h-full w-[70%] max-w-md p-4 transition-transform duration-300 ease-in-out border-l-2 rounded-l-lg overflow-y-auto z-50
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          ${theme === "basic" ? "bg-white text-black border-gray-400" : theme === "gray" ? "bg-gray-800 text-white border-gray-600" : "bg-black text-white border-gray-800"}`}
      >
        <h2 className="text-xl font-bold mb-4">📖 목차 및 검색</h2>

        {/* ✅ 검색 유형 선택 */}
        <Select value={searchType} onValueChange={(value) => { setSearchType(value); setCurrentListPage(1); }}>
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
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentListPage(1); }}
          className="w-full p-2 mb-4 border rounded"
        />

        {/* ✅ 검색 결과 목록 */}
        <ul className="space-y-2 mb-4">
          {paginatedItems.map((item, idx) => (
            <li key={idx} className="cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => goToPage(item.page, searchTerm)}>
              {searchType === "chapter" 
                ? highlightSearchTerm((item as { title: string }).title) 
                : <><strong>📌 {(item as ContentMatch).page + 1}페이지:</strong> {highlightSearchTerm(getContentPreview((item as ContentMatch).text))}</>
              }
            </li>
          ))}
        </ul>

        {/* ✅ 페이지네이션 */}
        {totalListPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentListPage((prev) => Math.max(1, prev - 1))} disabled={currentListPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>{currentListPage} / {totalListPages}</span>
            <Button variant="outline" size="icon" onClick={() => setCurrentListPage((prev) => Math.min(totalListPages, prev + 1))} disabled={currentListPage === totalListPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
