"use client";

import * as React from "react";
import Link from "next/link";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/custom/BubblePopover";
import { Button } from "@/components/ui/button";
import { PenTool, Plus, ChevronUp } from "lucide-react";

export default function BubbleMenuYesterday() {
  // 페이지 상단으로 스크롤 이동 함수
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-20 right-6">
      <Popover>
        <PopoverTrigger asChild>
          <Button className="h-14 w-14 rounded-full bg-brand text-white shadow-lg hover:bg-brand-dark">
            <Plus className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" side="top" className="flex flex-col space-y-2">
          {/* 글 작성하기 버튼 (today/create 경로로 이동) */}
          <Link href="/today/create" passHref>
            <Button asChild variant="ghost" className="flex items-center bg-white gap-2 rounded-full border-2 border-brand-light">
              <div>
                <PenTool className="h-5 w-5" />글 작성하기
              </div>
            </Button>
          </Link>

          {/* 맨 위로 버튼 (클릭 시 스크롤 이동) */}
          <Button variant="ghost" className="flex items-center bg-white gap-2 rounded-full border-2 border-brand-light" onClick={scrollToTop}>
            <ChevronUp className="h-5 w-5" />맨 위로
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
