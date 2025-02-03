"use client";

import { useState, useRef, useEffect } from "react";
import { useViewerSettings } from "../context/ViewerSettingsContext";
import { useBookData } from "../hooks/useBookData"; // ✅ useBookData 훅 사용
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";

interface TTSPanelProps {
  bookId: string;
}

export function TTSPanel({ bookId }: TTSPanelProps) {
  const { theme } = useViewerSettings();
  const { bookContent, isLoading } = useBookData(bookId); // ✅ API or 목업 데이터 가져오기
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState("김민순");

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // ✅ TTS 실행 함수
  const startTTS = () => {
    if (isLoading) {
      console.warn("📢 책 데이터를 불러오는 중입니다. 잠시 후 다시 시도하세요.");
      return;
    }

    console.log("📖 TTS에 전달되는 책 내용:", bookContent); // ✅ 디버깅용 로그

    // ✅ 피치 차이를 0.5 ~ 4.0으로 확장
    const pitchValue =
      pitch === "김민순" ? 0.5 : 
      pitch === "김민영" ? 2.0 : 
      4.0; // ✅ 김민지 (매우 높은 톤)

    const utterance = new SpeechSynthesisUtterance(bookContent);
    utterance.rate = rate;
    utterance.pitch = pitchValue;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  // ✅ TTS 정지 함수
  const stopTTS = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <>
      {/* ✅ TTS 버튼 */}
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
        <Volume2 className="h-5 w-5" />
      </Button>

      {/* ✅ 오버레이 (배경) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 transition-opacity" onClick={() => setIsOpen(false)} />
      )}

      {/* ✅ 패널 UI */}
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

        {/* ✅ 패널 닫기 버튼 */}
        <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
          ✕
        </button>

        {/* ✅ TTS 재생/정지 버튼 */}
        <button
          onClick={isPlaying ? stopTTS : startTTS}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
          disabled={isLoading} // ✅ 로딩 중일 때 버튼 비활성화
        >
          {isLoading ? "⏳ 로딩 중..." : isPlaying ? "🛑 정지" : "▶️ 전체 읽기"}
        </button>

        {/* ✅ 속도 설정 */}
        <div className="mt-4">
          <label className="block mb-1 font-semibold">🔄 속도</label>
          <select
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value={0.5}>느림</option>
            <option value={1.0}>보통</option>
            <option value={1.5}>빠름</option>
            <option value={2.0}>매우 빠름</option>
          </select>
        </div>

        {/* ✅ 피치 설정 */}
        <div className="mt-4">
          <label className="block mb-1 font-semibold">🎤 목소리</label>
          <select
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="김민순">김민순 (매우 낮은 목소리)</option>
            <option value="김민영">김민영 (보통 톤)</option>
            <option value="김민지">김민지 (매우 높은 목소리)</option>
          </select>
        </div>
      </div>
    </>
  );
}
