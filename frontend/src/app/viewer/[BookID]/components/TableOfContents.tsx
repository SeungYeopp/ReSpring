"use client";

import { useState, useMemo, useEffect } from "react";
import { useViewerSettings } from "../context/ViewerSettingsContext";
import { usePageContext } from "../context/PageContext";
import { useBookData } from "../hooks/useBookData";
import { useDynamicPages } from "../hooks/useDynamicPages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { usePanelContext } from "../context/usePanelContext";
// 챕터 정보 인터페이스
interface Chapter {
  title: string;
  page: number;
}

// 내용 검색 결과 인터페이스
interface ContentMatch {
  text: string;
  page: number;
}

const ITEMS_PER_PAGE = 10;

export function TableOfContents({ bookId, imageUrls }: { bookId: string; imageUrls: string[] }) {
  const { theme } = useViewerSettings();
  const { currentPage, totalPages, setCurrentPage, setHighlightKeyword } = usePageContext();
  const { bookContent } = useBookData(bookId);
  const { chapters, pages } = useDynamicPages(bookContent!, imageUrls);
  
  // 로컬 상태: 패널이 열렸는지 여부 (애니메이션 및 렌더링 제어용)
  const [isOpen, setIsOpen] = useState(false);
  const [searchType, setSearchType] = useState("chapter");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentListPage, setCurrentListPage] = useState(1);

  // PanelContext의 register/unregister 함수를 가져옵니다.
  const { registerPanel, unregisterPanel } = usePanelContext();

  useEffect(() => {
    console.log(imageUrls);
  }, [imageUrls]);

  // 검색어에 따른 챕터 필터링
  const filteredChapters = useMemo(
    () => chapters.filter((chap) => chap.title.toLowerCase().includes(searchTerm.toLowerCase())),
    [chapters, searchTerm]
  );

  // 페이지 텍스트를 검색어 기준으로 필터링하여 검색 결과 생성
  const contentMatches = useMemo(
    () =>
      pages
        .map((pageText, idx) => ({ text: pageText, page: idx }))
        .filter(({ text }) => text.toLowerCase().includes(searchTerm.toLowerCase())),
    [pages, searchTerm]
  );

  // 패널 토글 함수: 열릴 때 registerPanel, 닫힐 때 unregisterPanel 호출
  const togglePanel = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      if (newState) {
        // 패널이 열릴 때 전역 패널 카운트 등록
        registerPanel();
      } else {
        // 패널이 닫힐 때 전역 패널 카운트 해제 및 강조 효과 초기화
        unregisterPanel();
        setHighlightKeyword(null);
      }
      return newState;
    });
  };

  // 페이지 이동 함수: 현재 페이지와의 차이를 계산해 setCurrentPage에 전달
  const goToPage = (targetPage: number, keyword?: string) => {
    const difference = targetPage - currentPage;
    setCurrentPage(difference);
    if (keyword) {
      setHighlightKeyword(keyword);
    } else {
      setHighlightKeyword(null);
    }
    // 패널을 닫으면서 전역 패널 상태 해제
    setIsOpen(false);
    unregisterPanel();
  };

  const totalItems = searchType === "chapter" ? filteredChapters.length : contentMatches.length;
  const totalListPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentListPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems =
    searchType === "chapter" ? filteredChapters.slice(startIndex, endIndex) : contentMatches.slice(startIndex, endIndex);

  const handleListPageChange = (newPage: number) => {
    setCurrentListPage(newPage);
  };

  // 검색어 하이라이트 처리 함수
  const highlightSearchTerm = (text: string) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 text-black px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // 내용 미리보기 생성 함수 (검색어 주변 텍스트)
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
      {/* 패널을 열기 위한 버튼 */}
      <Button variant="ghost" size="icon" onClick={togglePanel}>
        <BookOpen className="h-5 w-5" />
      </Button>

      {/* 오버레이: 클릭 시 패널 닫힘 */}
      {isOpen && <div className="fixed inset-0 bg-black/40 transition-opacity" onClick={togglePanel} />}

      {/* 목차 및 검색 패널 */}
      <div
        className={`fixed top-0 right-0 h-full w-[70%] p-4 transition-transform duration-300 ease-in-out border-2 rounded-l-lg overflow-y-auto
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          ${theme === "basic" ? "bg-white text-black border-gray-400" : theme === "gray" ? "bg-gray-800 text-white border-gray-600" : "bg-black text-white border-gray-800"}`}
      >
        <h2 className="text-xl font-bold mb-4">📖 목차 및 검색</h2>

        {/* 검색 유형 선택 */}
        <Select
          value={searchType}
          onValueChange={(value) => {
            setSearchType(value);
            setCurrentListPage(1);
          }}
        >
          <SelectTrigger className="w-full mb-2">
            <SelectValue placeholder="검색 유형 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chapter">📑 챕터 검색</SelectItem>
            <SelectItem value="content">📜 내용 검색</SelectItem>
          </SelectContent>
        </Select>

        {/* 검색어 입력 */}
        <Input
          type="text"
          placeholder={searchType === "chapter" ? "🔍 챕터 제목 검색..." : "🔍 책 내용 검색..."}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentListPage(1);
          }}
          className="w-full p-2 mb-4 border rounded"
        />

        {/* 검색 결과 목록 */}
        <ul className="space-y-2 mb-4">
          {paginatedItems.map((item, idx) => (
            <li
              key={idx}
              className="cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => goToPage(item.page, searchTerm)}
            >
              {searchType === "chapter" ? (
                highlightSearchTerm((item as Chapter).title)
              ) : (
                <>
                  <strong>📌 {(item as ContentMatch).page + 1}페이지:</strong> {highlightSearchTerm(getContentPreview((item as ContentMatch).text))}
                </>
              )}
            </li>
          ))}
        </ul>

        {/* 페이지 네비게이션 */}
        {totalListPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => handleListPageChange(currentListPage - 1)} disabled={currentListPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              {currentListPage} / {totalListPages}
            </span>
            <Button variant="outline" size="icon" onClick={() => handleListPageChange(currentListPage + 1)} disabled={currentListPage === totalListPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* 현재 페이지 정보 표시 */}
        <div className="mt-4 text-center">
          <span className="font-semibold">
            현재 페이지: {currentPage + 1} / {totalPages}
          </span>
        </div>
      </div>
    </>
  );
}
