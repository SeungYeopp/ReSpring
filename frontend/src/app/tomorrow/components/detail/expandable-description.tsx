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
  const fullTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkHeight = () => {
      if (descriptionRef.current && fullTextRef.current) {
        const lineHeight = Number.parseFloat(window.getComputedStyle(descriptionRef.current).lineHeight);
        const maxHeight = lineHeight * 2;
        setShowButton(fullTextRef.current.offsetHeight > maxHeight);
      }
    };

    // 폰트 로딩을 기다리기 위해 약간의 지연을 줍니다.
    const timer = setTimeout(checkHeight, 100);

    window.addEventListener("resize", checkHeight);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkHeight);
    };
  }, []); // Removed unnecessary dependency: description

  return (
    <div className="relative">
      <p ref={descriptionRef} className={`text-gray-600 whitespace-pre-wrap break-words ${isExpanded ? "" : "line-clamp-1"}`}>
        {description}
      </p>
      <p ref={fullTextRef} className="absolute top-0 left-0 invisible whitespace-pre-wrap break-words" aria-hidden="true">
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
