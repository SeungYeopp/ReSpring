"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "../../lib/hooks/tempUseAuth";

export default function TestPage() {
  const { isLoggedIn, login, logout } = useAuth();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-bold text-primary">스타일 테스트</h1>

      {/* Tailwind 테스트 */}
      <div className="bg-slate-100 p-4 rounded-lg">
        <p className="text-blue-500 font-bold">Tailwind가 작동하면 이 텍스트는 파란색입니다.</p>
      </div>

      {/* shadcn/ui 테스트 */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">shadcn/ui 테스트</h2>
        <Button>이 버튼이 보이면 shadcn/ui가 작동합니다</Button>
      </Card>

      {/* 임시 로그인 테스트 */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">임시 로그인 테스트</h2>
        {isLoggedIn ? (
          <>
            <p className="mb-2">로그인 상태입니다.</p>
            <Button onClick={logout} variant="destructive">
              로그아웃
            </Button>
          </>
        ) : (
          <>
            <p className="mb-2">비로그인 상태입니다.</p>
            <Button onClick={login}>로그인</Button>
          </>
        )}
      </Card>
    </div>
  );
}
