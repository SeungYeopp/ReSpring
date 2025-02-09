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

  const { isAuthenticated } = useAuth(false); // 페이지가 바뀔때 마다 로그인 인증 확인.

  useEffect(() => {
    console.log("전체 조회", isAuthenticated);
    // 인증이 되지 않은 경우 auth로 라우팅.
    if (isAuthenticated === null){
      return;
    }else if(isAuthenticated === false){
      router.push('/auth');
      return;
    }

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
