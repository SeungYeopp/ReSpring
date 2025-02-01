"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PageContextProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (change: number) => void;
}

const PageContext = createContext<PageContextProps | undefined>(undefined);

export function PageProvider({ children, totalPages }: { children: ReactNode; totalPages: number }) {
  const [currentPage, setCurrentPage] = useState(0);

  const updatePage = (change: number) => {
    setCurrentPage((prev) => Math.min(Math.max(prev + change, 0), totalPages - 1));
  };

  return (
    <PageContext.Provider value={{ currentPage, totalPages, setCurrentPage: updatePage }}>
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
