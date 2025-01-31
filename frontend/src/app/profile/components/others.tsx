"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Others() {
  return (
    <div className="flex justify-between items-center w-[95%] p-4">
      <Link href="/yesterday/booklist" className="w-full mr-2">
        <Button className="w-full">구독하기</Button>
      </Link>
      <Link href="/yesterday/booklist" className="w-full mr-2">
        <Button className="w-full">메시지 보내기</Button>
      </Link>
    </div>
  );
}