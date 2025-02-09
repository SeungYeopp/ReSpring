"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableDescriptionProps {
  description: string;
}

export function ExpandableDescription({ description }: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (descriptionRef.current) {
      const element = descriptionRef.current;
      const lineHeight = Number.parseInt(window.getComputedStyle(element).lineHeight);
      setShowButton(element.scrollHeight > lineHeight * 2);
    }
  }, []); // 의존성 배열에 description 추가

  return (
    <div className="relative">
      <p ref={descriptionRef} className={`text-gray-600 whitespace-pre-wrap break-words ${isExpanded ? "" : "max-h-[2.6em] overflow-hidden"}`}>
        {description}
      </p>
      {showButton && (
        <button onClick={() => setIsExpanded(!isExpanded)} className="mt-1 text-[#8BC34A] hover:text-[#7CB342] flex items-center font-medium text-sm">
          {isExpanded ? (
            <>
              접기 <ChevronUp className="w-4 h-4 ml-1" />
            </>
          ) : (
            <>
              더보기 <ChevronDown className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
