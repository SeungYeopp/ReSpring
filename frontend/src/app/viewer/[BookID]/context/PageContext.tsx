"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface PageContextProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (change: number) => void;
  setTotalPages: (newTotal: number) => void; //   totalPages 업데이트 함수 추가
  highlightKeyword: string | null; // 강조할 키워드 상태를 추가
  setHighlightKeyword: (keyword: string | null) => void; // 강조할 키워드 상태를 추가
}

const PageContext = createContext<PageContextProps | undefined>(undefined);

export function PageProvider({ children, initialTotalPages }: { children: ReactNode; initialTotalPages: number }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(initialTotalPages); //   상태로 관리

  const updatePage = (change: number) => {
    setCurrentPage((prev) => Math.min(Math.max(prev + change, 0), totalPages - 1));
  };

  const [highlightKeyword, setHighlightKeyword] = useState<string | null>(null);

  return <PageContext.Provider value={{ highlightKeyword, setHighlightKeyword, currentPage, totalPages, setCurrentPage: updatePage, setTotalPages }}>{children}</PageContext.Provider>;
}

export function usePageContext() {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePageContext must be used within a PageProvider");
  }
  return context;
}
