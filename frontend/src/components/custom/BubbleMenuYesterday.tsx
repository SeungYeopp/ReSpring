"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, PenTool, ChevronUp } from 'lucide-react';

export default function BubbleMenuYesterday() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buttonClass = "flex items-center justify-center gap-2 rounded-full w-36 px-4 py-2";

  return (
    <div className="fixed bottom-20 right-6 flex flex-col space-y-2">
      <Link href="/yesterday/writenote" passHref>
        <Button
          variant="default"
          className={`${buttonClass} bg-brand text-white hover:bg-brand-dark`}
        >
          <PenTool className="h-5 w-5" />
          <span className="font-laundrygothicregular">글조각 쓰기</span>
        </Button>
      </Link>

      <Link href="/yesterday/create-book" passHref>
        <Button
          variant="default"
          className={`${buttonClass} bg-brand text-white hover:bg-brand-dark`}
        >
          <BookOpen className="h-5 w-5" />
          <span className="font-laundrygothicregular">봄날의 서 쓰기</span>
        </Button>
      </Link>

      <Button
        variant="outline"
        className={`${buttonClass} border-2 border-brand-light bg-white`}
        onClick={scrollToTop}
      >
        <ChevronUp className="h-5 w-5" />
        <span className="font-laundrygothicregular">맨 위로</span>
      </Button>
    </div>
  );
}