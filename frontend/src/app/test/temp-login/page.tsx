"use client";

import { useAuthWithUser } from "@/lib/hooks/tempUseAuthWithUser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TempLoginPage() {
  const { isLoggedIn, user, login, logout } = useAuthWithUser();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="p-6 w-80 text-center shadow-md bg-white">
        <h1 className="text-2xl font-bold mb-4">임시 로그인</h1>

        {isLoggedIn ? (
          <>
            <p className="text-gray-700 mb-2">
              환영합니다, <strong>{user?.name}</strong>님!
            </p>
            <Button onClick={logout} variant="destructive" className="w-full">
              로그아웃
            </Button>
          </>
        ) : (
          <>
            <p className="text-gray-500 mb-2">로그인하여 기능을 사용하세요.</p>
            <Button onClick={login} className="w-full">
              로그인
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
