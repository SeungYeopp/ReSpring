"use client";

import { useRouter } from "next/navigation";  // Next.js 라우터 사용
import { Button } from "@/components/ui/button";  // shadCN UI 버튼 컴포넌트

const LoadingTestPage = () => {
  const router = useRouter();  // 라우터 초기화

  // 버튼 클릭 시 해당 경로로 이동하는 함수
  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">로딩 컴포넌트 테스트 페이지</h1>

      {/* 각 테스트 페이지로 이동하는 버튼 */}
      <Button className="w-64" onClick={() => navigateTo("/test/loading/desk")}>
        데스크탑 로딩 테스트
      </Button>

      <Button className="w-64" onClick={() => navigateTo("/test/loading/tablet")}>
        태블릿 로딩 테스트
      </Button>

      <Button className="w-64" onClick={() => navigateTo("/test/loading/mobile")}>
        모바일 로딩 테스트
      </Button>

      <Button className="w-64" onClick={() => navigateTo("/test/loading/responsive")}>
        반응형 로딩 테스트
      </Button>

      <Button className="w-64" onClick={() => navigateTo("/test/loading/Progress")}>
        프로그레스 매니저 테스트
      </Button>
    </div>
  );
};

export default LoadingTestPage;
