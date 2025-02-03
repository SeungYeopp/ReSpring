"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Sprout } from "lucide-react";

// 타이핑 효과 훅
const useTypingEffect = (text: string, speed = 50) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return displayText;
};

export default function NotFound() {
  const router = useRouter();
  const title = useTypingEffect("찾으시는 봄날이 여기 없네요.");
  const subTitle = useTypingEffect("하지만 걱정마세요, 새로운 봄날이 기다리고 있답니다.", 30);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#e6f3d4] to-[#fce8e8] p-4 sm:p-6 md:p-8 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
      >
        <Sprout className="text-[#96b23c] w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4 min-h-[2.5em] leading-tight">{title}</h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6 md:mb-8 min-h-[3em] leading-relaxed">{subTitle}</p>

        <motion.div className="mb-6 sm:mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
            '다시, 봄(RE:Spring)'에서 여러분의 이야기는 계속됩니다. 어제의 추억, 오늘의 나눔, 그리고 내일의 도전이 여러분을 기다리고 있어요.
          </p>
        </motion.div>

        {/* 버튼 그룹 */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild className="w-full sm:w-auto px-6 sm:px-8 py-2 text-base sm:text-lg rounded-full bg-[#96b23c] hover:bg-[#7a9431] transition-all duration-300 hover:scale-105 shadow-lg">
            <Link href="/">다시, 봄으로 돌아가기</Link>
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto px-6 sm:px-8 py-2 text-base sm:text-lg rounded-full border-[#96b23c] text-[#96b23c] hover:bg-[#e6f3d4] transition-all duration-300 hover:scale-105 shadow-md"
            onClick={() => router.back()}
          >
            이전 페이지로
          </Button>
        </div>

        {/* 추천 콘텐츠 */}
        <motion.div className="mt-8 sm:mt-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4, duration: 1 }}>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">새로운 봄날의 이야기를 시작해볼까요?</h2>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/yesterday" className="text-[#96b23c] hover:underline flex items-center justify-center text-sm sm:text-base">
              <Sprout className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span>어제 (봄날의 서)</span>
            </Link>
            <Link href="/today" className="text-[#96b23c] hover:underline flex items-center justify-center text-sm sm:text-base">
              <Sprout className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span>오늘 (커뮤니티)</span>
            </Link>
            <Link href="/tomorrow" className="text-[#96b23c] hover:underline flex items-center justify-center text-sm sm:text-base">
              <Sprout className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span>내일 (챌린지)</span>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
