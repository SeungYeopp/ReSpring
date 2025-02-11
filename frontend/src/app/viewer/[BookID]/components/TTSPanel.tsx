"use client"

import { useState, useRef } from "react"
import { useViewerSettings } from "../context/ViewerSettingsContext"
import { useBookData } from "../hooks/useBookData"
import { Button } from "@/components/ui/button"
import { Volume2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Content } from "@/lib/api"
interface TTSPanelProps {
  bookId: string
}

export function TTSPanel({ bookId }: TTSPanelProps) {
  const { theme } = useViewerSettings()
  const { bookContent, isLoading } = useBookData(bookId)
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [rate, setRate] = useState(1.0)
  const [pitch, setPitch] = useState("김민순")

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)

  function contentToString(content: Content): string {
    return Object.entries(content)
      .map(([chapterTitle, chapterContent]) => `📖 ${chapterTitle}\n${chapterContent}`)
      .join("\n\n"); // 각 챕터 사이에 개행 추가
  }

  const startTTS = () => {
    if (isLoading) {
      console.warn("📢 책 데이터를 불러오는 중입니다. 잠시 후 다시 시도하세요.")
      return
    }

    console.log("📖 TTS에 전달되는 책 내용:", bookContent)

    const pitchValue = pitch === "김민순" ? 0.5 : pitch === "김민영" ? 2.0 : 4.0

    const bookContentStr = contentToString(bookContent ?? {})
    // const utterance = new SpeechSynthesisUtterance(bookContent) 나중에 수정 필요.
    const utterance = new SpeechSynthesisUtterance(bookContentStr)
    utterance.rate = rate
    utterance.pitch = pitchValue

    utterance.onend = () => {
      setIsPlaying(false)
    }

    speechRef.current = utterance
    speechSynthesis.speak(utterance)
    setIsPlaying(true)
  }

  const stopTTS = () => {
    speechSynthesis.cancel()
    setIsPlaying(false)
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
        <Volume2 className="h-5 w-5" />
      </Button>

      {isOpen && <div className="fixed inset-0 bg-black/40 transition-opacity" onClick={() => setIsOpen(false)} />}

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

        <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
          ✕
        </button>

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
  )
}

