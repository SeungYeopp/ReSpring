"use client";

import { useState, useMemo, useEffect } from "react";
import { useViewerSettings } from "../context/ViewerSettingsContext";
import { usePageContext } from "../context/PageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { usePanelContext } from "../context/usePanelContext";

interface TableOfContentsProps {
  pages: { body: string[] }[];
  chapters?: { title: string; page: number }[];
}

// 내용 검색 결과 인터페이스
interface ContentMatch {
  text: string;
  page: number;
}

export function TableOfContents({ pages, chapters = [] }: TableOfContentsProps) {
  const { theme } = useViewerSettings();
  const { currentPage, totalPages, setCurrentPage, setHighlightKeyword } = usePageContext();

  const [isOpen, setIsOpen] = useState(false);
  const [searchType, setSearchType] = useState("chapter"); // ✅ 검색 유형 상태 추가
  const [searchTerm, setSearchTerm] = useState("");
  const [currentListPage, setCurrentListPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  // PanelContext에서 현재 열린 패널의 ID와, 패널을 열기(openPanel) 및 닫기(closePanel) 위한 함수를 가져옵니다.
  const { currentOpenPanel, openPanel, closePanel } = usePanelContext();

  // // 효과: imageUrls가 변경될 때 콘솔에 출력합니다.
  // useEffect(() => {
  //   console.log(imageUrls);
  // }, [imageUrls]);

  // 효과: 전역 패널 상태(currentOpenPanel)를 감시하여,
  // 만약 이 TableOfContents 패널이 열려있는데(currentOpenPanel가 "toc"여야 함),
  // 다른 패널이 열리면 자동으로 로컬 패널을 닫습니다.
  useEffect(() => {
    if (isOpen && currentOpenPanel !== "toc") {
      setIsOpen(false);
    }
  }, [currentOpenPanel, isOpen]);

  // ✅ 챕터 검색
  const filteredChapters = useMemo(() => chapters?.filter((chap) => chap.title.toLowerCase().includes(searchTerm.toLowerCase())) || [], [chapters, searchTerm]);

  // const contentMatches = useMemo(() =>
  //   pages.flatMap((page, idx) =>
  //     page.body.map((bodyText) => ({ text: bodyText, page: idx }))
  //   ).filter(({ text }) => text.toLowerCase().includes(searchTerm.toLowerCase())),
  //   [pages, searchTerm]
  // );

  const contentMatches = useMemo(() => {
    if (!searchTerm.trim()) {
      return []; // 🔥 검색어가 비어있으면 빈 배열 반환 (즉, 아무것도 안 보여줌)
    }

    return pages.flatMap((page, idx) => page.body.map((bodyText) => ({ text: bodyText, page: idx }))).filter(({ text }) => text.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [pages, searchTerm]);

  /*
    패널 토글 함수:
    - 사용자가 버튼을 클릭하면 호출됩니다.
    - 만약 패널을 열면, 자신의 고유 ID "toc"를 전역 상태에 등록합니다.
    - 만약 패널을 닫으면, 전역 상태를 해제하고 강조 효과도 초기화합니다.
  */

  const togglePanel = () => {
    setIsOpen((prev: boolean) => {
      const newState = !prev;
      if (newState) {
        // 패널이 열리면 자신의 ID "toc"를 전역 상태에 등록합니다.
        openPanel("toc");
      } else {
        // 패널이 닫히면 전역 상태를 해제하고 강조 효과를 초기화합니다.
        closePanel();
        setHighlightKeyword(null);
      }
      return newState;
    });
  };

  /*
    페이지 이동 함수:
    - 목표 페이지와 현재 페이지의 차이를 계산하여 setCurrentPage에 전달합니다.
    - 또한, 검색어(keyword)가 있으면 강조 효과를 설정합니다.
    - 마지막으로 패널을 닫으며 전역 패널 상태를 해제합니다.
  */
  // ✅ 페이지 이동 및 키워드 강조
  const goToPage = (targetPage: number, keyword?: string) => {
    const difference = targetPage - currentPage;
    setCurrentPage(difference);
    setHighlightKeyword(keyword || null);
    setIsOpen(false);
    closePanel();
  };

  // ✅ 현재 페이지네이션 설정
  const totalItems = searchType === "chapter" ? filteredChapters.length : contentMatches.length;
  const totalListPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentListPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedItems = searchType === "chapter" ? filteredChapters.slice(startIndex, endIndex) : contentMatches.slice(startIndex, endIndex);

  // ✅ 검색어 강조 표시
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
      {/* 패널을 열기 위한 버튼 */}
      {/* ✅ 오른쪽 아래 목차 버튼 */}
      <Button variant="ghost" size="icon" onClick={togglePanel}>
        <BookOpen className="h-6 w-6" />
      </Button>

      {/* 오버레이: 클릭 시 패널 닫힘 */}
      {isOpen && <div className="fixed inset-0 bg-black/40 transition-opacity" onClick={togglePanel} />}

      <div
        className={`fixed top-0 right-0 h-full w-[70%] max-w-md p-4 transition-transform duration-300 ease-in-out border-l-2 rounded-l-lg overflow-y-auto z-50
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          ${theme === "basic" ? "bg-white text-black border-gray-400" : theme === "gray" ? "bg-gray-800 text-white border-gray-600" : "bg-black text-white border-gray-800"}`}
      >
        <h2 className="text-xl font-bold mb-4">📖 목차 및 검색</h2>

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

        {/* ✅ 검색 결과 목록 */}
        <ul className="space-y-2 mb-4">
          {paginatedItems.map((item, idx) => (
            <li key={idx} className="cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => goToPage(item.page, searchTerm)}>
              {searchType === "chapter" ? (
                highlightSearchTerm((item as { title: string }).title)
              ) : (
                <>
                  <strong>📌 {(item as ContentMatch).page + 1}페이지:</strong> {highlightSearchTerm(getContentPreview((item as ContentMatch).text))}
                </>
              )}
            </li>
          ))}
        </ul>

        {/* ✅ 페이지네이션 */}
        {totalListPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentListPage((prev) => Math.max(1, prev - 1))} disabled={currentListPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              {currentListPage} / {totalListPages}
            </span>
            <Button variant="outline" size="icon" onClick={() => setCurrentListPage((prev) => Math.min(totalListPages, prev + 1))} disabled={currentListPage === totalListPages}>
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
