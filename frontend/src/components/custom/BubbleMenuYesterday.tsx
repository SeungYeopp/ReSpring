"use client";

import * as React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/custom/BubblePopover"; 
import { Button } from "@/components/ui/button";
import { BookOpen, PenTool, Plus} from "lucide-react"; // 아이콘 사용
import { on } from "events";

interface BubbleMenuYesterdayProps{
  onStoryEditorClick: () => void;
  onBookEditorClick: () => void;
}

export default function BubbleMenuYesterday({onStoryEditorClick, onBookEditorClick}: BubbleMenuYesterdayProps) {
  return (
    <div className="fixed bottom-20 right-6">
      <Popover>
        <PopoverTrigger asChild>
          <Button className="h-14 w-14 rounded-full bg-brand text-white shadow-lg hover:bg-brand-dark">
            <Plus className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="top"
          className="flex flex-col space-y-2"
        >
          <Button 
          onClick={onStoryEditorClick}
          variant="ghost" className="flex items-center gap-2 bg-white rounded-full border-2 border-brand-light">
            <PenTool  className="h-5 w-5" />
            글조각 쓰기
          </Button>
          <Button 
          onClick={onBookEditorClick}
          variant="ghost" className="flex items-center gap-2 bg-white rounded-full border-2 border-brand-light">
            <BookOpen className="h-5 w-5" />
            봄날의 서 쓰기
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
