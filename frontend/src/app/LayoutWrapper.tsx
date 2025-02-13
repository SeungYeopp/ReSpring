"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SplashScreen from "@/components/custom/SplashScreen";
import { TopNav } from "@/components/layout/top-nav";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuth } from "@/hooks/useAuth";
import LoadingScreen from "@/components/custom/LoadingScreen";

import ToastNotification from "../components/custom/ToastNotification"; // 토스트 알림 컴포넌트
// 기존
import useNotifications from "../hooks/useNotifications"; // SSE 알림 훅
// 테스트용으로 교체:
// import useMockNotifications from "@/hooks/useMockNotifications"; //                                          민철씨 알림 여기에요

const SPLASH_EXPIRE_HOURS = 24; // 스플래시 화면이 다시 표시되기까지의 유효 시간(24시간)

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false); // 스플래시 화면 표시 여부 상태 관리
  const router = useRouter(); // Next.js 라우터 훅, 클라이언트 사이드 네비게이션 제어
  const pathname = usePathname(); // 현재 URL 경로를 가져오기 위한 훅

  const isViewerPage = pathname.startsWith("/viewer");
  // "/viewer" 경로로 시작하는 페이지인지 여부 (뷰어 페이지에서는 네비게이션 숨김)

  const isBookDetailPage = pathname.startsWith("/yesterday/newbook"); 
  // "/viewer" 경로로 시작하는 페이지인지 여부 (뷰어 페이지에서는 네비게이션 숨김)

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

  const isTestOnboardingPage = pathname.startsWith("/test/onboarding");
  // 온보딩 테스트 페이지인지 확인하여 네비게이션 숨김 처리

  const isMainPage = pathname.startsWith("/main");
  // 메인인 페이지인지 확인하여 네비게이션 숨김 처리

  const { isAuthenticated } = useAuth(false);
  // 사용자 인증 상태 확인 (false는 인증 실패 시 자동 리다이렉트 방지)

  // SSE를 통한 알림 데이터를 받아 토스트 알림 컴포넌트에 전달합니다.
  // 나중에 실제 API 연결 후에는 useNotifications로 바꿔야 함.
  const userId = "beb9ebc2-9d32-4039-8679-5d44393b7252";
  const { notifications } = useNotifications(`http://localhost:8080/notifications/subscribe/${userId}`);
  // const { notifications } = useMockNotifications();

  useEffect(() => {
    if (isAuthenticated === null) {
      // 인증 상태를 아직 확인 중일 때 아무 동작하지 않음
      return;
    } else if (isAuthenticated === false) {
      // 인증되지 않은 경우 로그인 페이지로 리다이렉트
      router.push("/auth");
      return;
    }

    // 스플래시 화면 표시 여부 결정 로직
    const lastSeenTimestamp = localStorage.getItem("splashTimestamp");
    // 마지막으로 스플래시를 본 시간을 로컬 스토리지에서 가져옴
    const now = Date.now(); // 현재 시간 (밀리초 단위)

    if (lastSeenTimestamp) {
      const elapsedHours = (now - Number(lastSeenTimestamp)) / (1000 * 60 * 60);
      // 마지막 본 시간과 현재 시간의 차이를 시간 단위로 계산
      if (elapsedHours < SPLASH_EXPIRE_HOURS) {
        // 마지막 스플래시 이후 24시간이 지나지 않았다면 다시 표시하지 않음
        if (pathname === "/") {
          // 루트 경로("/")로 접근 시 자동으로 "/today"로 리다이렉트
          router.replace("/main");
        }
        return;
      }
    }

    // 스플래시 화면 표시 (4초 동안)
    setShowSplash(true);
    const timer = setTimeout(() => {
      setShowSplash(false); // 4초 후 스플래시 종료
      localStorage.setItem("splashTimestamp", String(now));
      // 현재 시간을 로컬 스토리지에 저장하여 스플래시 재표시 방지
      router.replace("/today"); // 스플래시 종료 후 "/today"로 리다이렉트
    }, 4000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [router, pathname, isAuthenticated]);
  // useEffect 의존성 배열: 라우터, 현재 경로, 인증 상태가 변경될 때마다 실행

  if (isAuthenticated === null) {
    // return <p>로딩 중...</p>;
    return <LoadingScreen />
    // 인증 상태를 확인하는 동안 로딩 메시지 표시 => 로딩 스크린 표시
  }

  if (showSplash) {
    return <SplashScreen />;
    // 스플래시 화면 표시 상태일 때 SplashScreen 컴포넌트 렌더링
  }

  return (
    <>
      {/* 토스트 알림 컴포넌트 */}
      <ToastNotification notifications={notifications} />

      {/* TopNav를 /viewer, /chat, /test/onboarding 페이지에서 숨김 */}
      {isAuthenticated && !isViewerPage && !isBookDetailPage && !isChatPage && !isTestOnboardingPage && !isMainPage && <TopNav />}
      
      {/* Sidebar를 /test/onboarding 페이지에서 숨김 */}
      {isAuthenticated && !isTestOnboardingPage && <Sidebar />}

      {/* 메인 콘텐츠 영역 렌더링 */}
      <main
        className={`${
          isViewerPage || isChatPage || isTestOnboardingPage || isMainPage
            ? "pt-0 pb-0 md:py-0" // 특정 페이지에서는 패딩 제거하여 전체 화면 사용
            : "pt-14 pb-16 md:py-4" // 기본 페이지에서는 상하 패딩 적용
        } ${
          isTestOnboardingPage
            ? "" // 온보딩 테스트 페이지에서는 좌측 마진 제거 (사이드바 숨김)
            : "md:ml-64" // md 이상 화면에서는 사이드바 공간만큼 좌측 마진 적용
        }`}
      >
        {children} {/* 자식 컴포넌트 렌더링 */}
      </main>

      {/* BottomNav를 /viewer, /chat, /test/onboarding 페이지에서 숨김 */}
      {isAuthenticated && !isViewerPage && !isBookDetailPage && !isChatPage && !isTestOnboardingPage && !isMainPage && <BottomNav />}
    </>
  );
}
