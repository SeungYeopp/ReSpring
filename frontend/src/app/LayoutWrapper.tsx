// src/components/layout/LayoutWrapper.tsx
"use client"; // 클라이언트 컴포넌트로 설정

import { usePathname } from "next/navigation";
import { TopNav } from "@/components/layout/top-nav";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isViewerPage = pathname.startsWith("/viewer"); // viewer 페이지 여부 확인

  return (
    <>
      {!isViewerPage && <TopNav />}
      {!isViewerPage && <Sidebar />}
      {/* viewer 패딩을 TopToolbar 사이즈에 맞게 조정 */}
      <main className={isViewerPage ? "pt pb md:py-4" : "md:ml-64 pt-14 pb-16 md:py-4"}>{children}</main>

      {!isViewerPage && <BottomNav />}
    </>
  );
}
