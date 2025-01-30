"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Me() {
  return (
    <div className="flex justify-between items-center w-[95%] p-4">
      <Link href="/yesterday/booklist" className="w-full mr-2">
        <Button className="w-full">내 서재 보기</Button>
      </Link>
      <Link href="/yesterday/booklist" className="w-full mr-2">
        <Button className="w-full">구독한 사람 보기</Button>
      </Link>
      <div className="ml-2 cursor-pointer p-2 rounded-full hover:bg-gray-200">
        <span className="text-xl">⚙️</span>
      </div>
    </div>
  );
}