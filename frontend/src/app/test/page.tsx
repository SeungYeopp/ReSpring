"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "../../lib/hooks/tempUseAuth"

export default function TestPage() {
  const { isLoggedIn, login, logout } = useAuth()

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-primary text-center mb-8">테스트 페이지</h1>

      {/* 테스트 페이지 네비게이션 */}
      <Card className="p-6 bg-secondary">
        <h2 className="text-2xl font-semibold mb-4 text-secondary-foreground">테스트 페이지 목록</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/test/onboarding" passHref>
            <Button className="w-full">온보딩 테스트</Button>
          </Link>
          <Link href="/test/MediaChat" passHref>
            <Button className="w-full">화상채팅 테스트</Button>
          </Link>
        </div>
      </Card>

      {/* Tailwind 테스트 */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Tailwind 테스트</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <p className="text-blue-500 font-bold">Tailwind가 작동하면 이 텍스트는 파란색입니다.</p>
        </div>
      </Card>

      {/* shadcn/ui 테스트 */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">shadcn/ui 테스트</h2>
        <Button className="w-full sm:w-auto">이 버튼이 보이면 shadcn/ui가 작동합니다</Button>
      </Card>

      {/* 임시 로그인 테스트 */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">임시 로그인 테스트</h2>
        {isLoggedIn ? (
          <div className="space-y-2">
            <p className="mb-2">로그인 상태입니다.</p>
            <Button onClick={logout} variant="destructive" className="w-full sm:w-auto">
              로그아웃
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="mb-2">비로그인 상태입니다.</p>
            <Button onClick={login} className="w-full sm:w-auto">
              로그인
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

