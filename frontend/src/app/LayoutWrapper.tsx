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

  // 정규표현식 설명:
  // ^         : 문자열의 시작을 의미 ("/"로 시작해야 함)
  // \/chat\/  : "/chat/" 문자열과 정확히 일치해야 함
  // \w+       : 하나 이상의 문자, 숫자, 또는 밑줄(_)과 일치 (chatID 부분)
  // $         : 문자열의 끝을 의미 (추가 경로 없이 끝나야 함)

  // 예시:
  // - "/chat/123"  => 감지 (O)
  // - "/chat/abc"  => 감지 (O)
  // - "/chat/abc123" => 감지 (O)
  // - "/chat/settings" => 감지 안 됨 (X)
  // - "/chat/123/more" => 감지 안 됨 (X)
  const isChatPage = /^\/chat\/\w+$/.test(pathname); // "/chat/ID" 형식만 감지

  const { isAuthenticated } = useAuth(false);

  useEffect(() => {
    if (isAuthenticated === null) {
      return;
    } else if (isAuthenticated === false) {
      router.push("/auth");
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
      {/* TopNav를 /viewer, /chat 페이지에서 숨김 */}
      {isAuthenticated && !isViewerPage && !isChatPage && <TopNav />}
      {/* Sidebar는 항상 표시 */}
      {isAuthenticated && <Sidebar />}

      <main className={`md:ml-64 ${isViewerPage || isChatPage ? "pt-0 pb-0" : "pt-14 pb-16"} md:py-4`}>{children}</main>

      {/* BottomNav를 /viewer, /chat 페이지에서 숨김 */}
      {isAuthenticated && !isViewerPage && !isChatPage && <BottomNav />}
    </>
  );
}
