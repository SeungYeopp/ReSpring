"use client"

import type React from "react"

export default function TodayLayout({ children }: { children: React.ReactNode }) {
  return (
    // 전체 레이아웃을 flex container로 설정
    // min-h-screen으로 최소한 전체 화면 높이를 차지하도록 설정
    <div className="min-h-screen flex flex-col">
      {/* 임시 헤더 (나중에 공통 헤더로 교체 예정) */}
      <header className="h-16 bg-primary text-white flex items-center justify-center">
        <h1 className="text-xl font-bold">오늘</h1>
      </header>

      {/* 메인 콘텐츠 영역 */}
      {/* flex-1을 사용하여 헤더와 푸터 사이의 남은 공간을 모두 차지하도록 설정 */}
      <main className="flex-1 bg-gray-50">{children}</main>

      {/* 임시 푸터 (나중에 공통 푸터로 교체 예정) */}
      <footer className="h-16 bg-gray-200 flex items-center justify-center">
        <p className="text-sm text-gray-600">© 2024 퇴직자 응원 웹사이트</p>
      </footer>
    </div>
  )
}

