"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SplashScreen from "@/components/custom/SplashScreen";
import { TopNav } from "@/components/layout/top-nav";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
const SPLASH_EXPIRE_HOURS = 24; // ✅ 24시간 후 다시 표시

import { getSessionInfo } from "@/lib/api";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const isViewerPage = pathname.startsWith("/viewer");

  const blockUser : boolean = true; // 로그인하지 않은 경우 막을지 결정.

  let authed = false;
  
  // ✅ 1. 렌더링 전에 로컬 스토리지 확인 후 즉시 리디렉션
  useEffect(() => {
    const handleInitialSetting = async () => {
      
      try{
        const session = await getSessionInfo();

        if(session && session.userId){
          authed = true;
          setIsAuthenticated(true)
        }
        else{
          authed = false;
          setIsAuthenticated(false)
        }
      }catch(error){
        authed = false;
        setIsAuthenticated(false)
      }

      if(!authed && blockUser){
        router.replace("/auth");
        return;
      }

      const lastSeenTimestamp = localStorage.getItem("splashTimestamp");
      const now = Date.now();

      if (lastSeenTimestamp) {
        const elapsedHours = (now - Number(lastSeenTimestamp)) / (1000 * 60 * 60);
        if (elapsedHours < SPLASH_EXPIRE_HOURS) {
          if (pathname === "/") {
            router.replace("/today"); // ✅ 스플래시 없이 즉시 이동
          }
          return;
        }
      }

      // ✅ 2. 스플래시가 필요한 경우 상태 업데이트
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
        localStorage.setItem("splashTimestamp", String(now)); // ✅ 현재 시간을 저장
        router.replace("/today"); // ✅ /today로 이동
      }, 4000); // 4초간 표시

      return () => clearTimeout(timer);
    }

    handleInitialSetting();
  }, [router, pathname]);

  // ✅ 3. 스플래시가 필요한 경우만 표시
  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <>
    {!isViewerPage && <TopNav />}
    {!isViewerPage && <Sidebar />}
    <main className={isViewerPage ? "pt pb md:py-4" : "md:ml-64 pt-14 pb-16 md:py-4"}>
      {children}
    </main>
    {!isViewerPage && <BottomNav />}
    </>
  );
}
