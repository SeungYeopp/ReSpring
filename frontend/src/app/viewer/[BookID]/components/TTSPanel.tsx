"use client";

import { useState, useRef } from "react";
import { useViewerSettings } from "../context/ViewerSettingsContext";
// PanelContext를 통해 전역 패널 상태에 접근
import { usePanelContext } from "../context/usePanelContext";
import { useBookData } from "../hooks/useBookData";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Content } from "@/lib/api";

interface TTSPanelProps {
  bookId: string;
}

/*
  TTSPanel 컴포넌트는 책의 내용을 음성으로 읽어주는 기능을 제공합니다.
  패널이 열릴 때마다 전역 PanelContext에 등록하여, 페이지 이동 등의 이벤트를 차단할 수 있도록 합니다.
*/
export function TTSPanel({ bookId }: TTSPanelProps) {
  const { theme } = useViewerSettings();
  const { bookContent, isLoading } = useBookData(bookId);
  // 로컬 상태: 패널 열림 여부, 음성 재생 상태 등
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState("김민순");

  // PanelContext의 registerPanel과 unregisterPanel 사용
  const { registerPanel, unregisterPanel } = usePanelContext();

  // SpeechSynthesisUtterance 참조
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 책 콘텐츠 객체를 문자열로 변환하는 함수
  function contentToString(content: Content): string {
    return Object.entries(content)
      .map(([chapterTitle, chapterContent]) => `📖 ${chapterTitle}\n${chapterContent}`)
      .join("\n\n"); // 각 챕터 사이에 개행 추가
  }

  // TTS 시작 함수
  const startTTS = () => {
    if (isLoading) {
      console.warn("📢 책 데이터를 불러오는 중입니다. 잠시 후 다시 시도하세요.");
      return;
    }

    console.log("📖 TTS에 전달되는 책 내용:", bookContent);

    const pitchValue = pitch === "김민순" ? 0.5 : pitch === "김민영" ? 2.0 : 4.0;

    const bookContentStr = contentToString(bookContent ?? {});
    const utterance = new SpeechSynthesisUtterance(bookContentStr);
    utterance.rate = rate;
    utterance.pitch = pitchValue;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  // TTS 중지 함수
  const stopTTS = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  // 패널 토글 함수: 열릴 때 전역 상태에 등록, 닫힐 때 해제
  const togglePanel = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      if (newState) {
        // 패널이 열리면 전역 상태에 등록
        registerPanel();
      } else {
        // 패널이 닫히면 전역 상태에서 해제
        unregisterPanel();
      }
      return newState;
    });
  };

  return (
    <>
      {/* TTS 패널 열기 버튼 */}
      <Button variant="ghost" size="icon" onClick={togglePanel}>
        <Volume2 className="h-5 w-5" />
      </Button>

      {/* 오버레이: 클릭 시 패널 닫힘 */}
      {isOpen && <div className="fixed inset-0 bg-black/40 transition-opacity" onClick={togglePanel} />}

      {/* TTS 패널 영역 */}
      <div
        className={`fixed bottom-0 left-0 w-full p-4 transition-transform duration-300 ease-in-out border-2 rounded-t-lg
          ${isOpen ? "translate-y-0" : "translate-y-full"}
          ${
            theme === "basic"
              ? "bg-white text-black border-gray-400"
              : theme === "gray"
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-black text-white border-gray-800"
          }`}
      >
        <h2 className="text-xl font-bold mb-4">📢 음성 설정</h2>

        {/* 패널 닫기 버튼 (패널 영역 내부 우측 상단) */}
        <button onClick={togglePanel} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
          ✕
        </button>

        {/* TTS 시작/중지 버튼 */}
        <Button
          onClick={isPlaying ? stopTTS : startTTS}
          className={`w-full ${
            theme === "basic"
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : theme === "gray"
              ? "bg-blue-700 hover:bg-blue-800 text-white"
              : "bg-blue-900 hover:bg-blue-950 text-gray-100"
          } transition`}
          disabled={isLoading}
        >
          {isLoading ? "⏳ 로딩 중..." : isPlaying ? "🛑 정지" : "▶️ 전체 읽기"}
        </Button>

        {/* 속도 선택 */}
        <div className="mt-4">
          <label className="block mb-1 font-semibold">🔄 속도</label>
          <Select value={rate.toString()} onValueChange={(value) => setRate(Number.parseFloat(value))}>
            <SelectTrigger className={`w-full ${theme === "basic" ? "bg-white" : "bg-gray-700"}`}>
              <SelectValue placeholder="속도 선택" />
            </SelectTrigger>
            <SelectContent
              className={`${
                theme === "basic"
                  ? "bg-white border-gray-200 text-gray-900"
                  : theme === "gray"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-black border-gray-800 text-white"
              }`}
            >
              <SelectItem value="0.5">느림</SelectItem>
              <SelectItem value="1.0">보통</SelectItem>
              <SelectItem value="1.5">빠름</SelectItem>
              <SelectItem value="2.0">매우 빠름</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 목소리 선택 */}
        <div className="mt-4">
          <label className="block mb-1 font-semibold">🎤 목소리</label>
          <Select value={pitch} onValueChange={(value) => setPitch(value)}>
            <SelectTrigger className={`w-full ${theme === "basic" ? "bg-white" : "bg-gray-700"}`}>
              <SelectValue placeholder="목소리 선택" />
            </SelectTrigger>
            <SelectContent
              className={`${
                theme === "basic"
                  ? "bg-white border-gray-200 text-gray-900"
                  : theme === "gray"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-black border-gray-800 text-white"
              }`}
            >
              <SelectItem value="김민순">김민순 (매우 낮은 목소리)</SelectItem>
              <SelectItem value="김민영">김민영 (보통 톤)</SelectItem>
              <SelectItem value="김민지">김민지 (매우 높은 목소리)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
