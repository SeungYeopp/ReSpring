  "use client";

  import * as React from "react";
  import { Popover, PopoverTrigger, PopoverContent } from "@/components/custom/BubblePopover"; 
  import { Button } from "@/components/ui/button";
  import { PenTool, Plus, ChevronUp } from "lucide-react"; // 아이콘 사용

  export default function BubbleMenuYesterday() {
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
            <Button variant="ghost" className="flex items-center gap-2 rounded-full border-2 border-brand-light">
              <PenTool  className="h-5 w-5" />
              글 작성하기
            </Button>
            <Button variant="ghost" className="flex items-center gap-2 rounded-full border-2 border-brand-light">
              <ChevronUp className="h-5 w-5" />
              맨 위로
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
