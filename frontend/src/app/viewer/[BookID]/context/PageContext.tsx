"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface PageContextProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (change: number) => void;
  setTotalPages: (newTotal: number) => void; // ✅ totalPages 업데이트 함수 추가
}

const PageContext = createContext<PageContextProps | undefined>(undefined);

export function PageProvider({ children, initialTotalPages }: { children: ReactNode; initialTotalPages: number }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(initialTotalPages); // ✅ 상태로 관리

  const updatePage = (change: number) => {
    setCurrentPage((prev) => Math.min(Math.max(prev + change, 0), totalPages - 1));
  };

  return (
    <PageContext.Provider value={{ currentPage, totalPages, setCurrentPage: updatePage, setTotalPages }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePageContext() {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePageContext must be used within a PageProvider");
  }
  return context;
}
