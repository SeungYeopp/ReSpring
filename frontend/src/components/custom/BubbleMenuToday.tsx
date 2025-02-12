"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PenTool, ChevronUp } from "lucide-react"

export default function BubbleMenuToday() {
  // 페이지 상단으로 스크롤 이동 함수
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="fixed bottom-20 right-6 flex flex-col space-y-2">
      {/* 글 작성하기 버튼 (today/create 경로로 이동) */}
      <Link href="/today/create" passHref>
        <Button
          variant="default"
          className="flex items-center gap-2 rounded-full bg-brand text-white hover:bg-brand-dark"
        >
          <PenTool className="h-5 w-5" />
          <span className="font-laundrygothicregular sm:inline">글 쓰기</span>
        </Button>
      </Link>

      {/* 맨 위로 버튼 (클릭 시 스크롤 이동) */}
      <Button
        variant="outline"
        className="flex items-center gap-2 rounded-full border-2 border-brand-light bg-white"
        onClick={scrollToTop}
      >
        <ChevronUp className="h-5 w-5" />
        <span className="font-laundrygothicregular sm:inline">맨 위로</span>
      </Button>
    </div>
  )
}

