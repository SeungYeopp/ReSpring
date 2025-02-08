"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SplashScreen from "@/components/custom/SplashScreen";
import { TopNav } from "@/components/layout/top-nav";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";

import { useAuth } from "@/hooks/useAuth";

const SPLASH_EXPIRE_HOURS = 24;

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isViewerPage = pathname.startsWith("/viewer");

  const { isAuthenticated } = useAuth(false);

  useEffect(() => {
    if (isAuthenticated === null) return;
    if (isAuthenticated === false) return; // ✅ 로그인되지 않았다면 더 진행할 필요 없음.

    const lastSeenTimestamp = localStorage.getItem("splashTimestamp");
    const now = Date.now();

    if (lastSeenTimestamp) {
      const elapsedHours = (now - Number(lastSeenTimestamp)) / (1000 * 60 * 60);
      if (elapsedHours < SPLASH_EXPIRE_HOURS) {
        if (pathname === "/") {
          router.replace("/today");
        }
        return;
      }
    }

    setShowSplash(true);
    const timer = setTimeout(() => {
      setShowSplash(false);
      localStorage.setItem("splashTimestamp", String(now));
      router.replace("/today");
    }, 4000);

    return () => clearTimeout(timer);
  }, [router, pathname, isAuthenticated]);

  if (isAuthenticated === null) {
    return <p>로딩 중...</p>;
  }

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <>
      {isAuthenticated && !isViewerPage && <TopNav />}
      {isAuthenticated && !isViewerPage && <Sidebar />}
      <main className={isViewerPage ? "pt pb md:py-4" : "md:ml-64 pt-14 pb-16 md:py-4"}>
        {children}
      </main>
      {isAuthenticated && !isViewerPage && <BottomNav />}
    </>
  );
}
