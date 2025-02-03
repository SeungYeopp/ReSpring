"use client";

import React, { useState } from "react";
import { useViewerSettings } from "../context/ViewerSettingsContext";

interface TTSPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/** TTS 패널: 하단에서 슬라이드 업 */
export function TTSPanel({ isOpen, onClose }: TTSPanelProps) {
  const { theme } = useViewerSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);

  const handleToggleTTS = () => {
    if (!isPlaying) {
      const utterance = new SpeechSynthesisUtterance("TTS 테스트 문장입니다!");
      utterance.rate = rate;
      utterance.pitch = pitch;
      speechSynthesis.speak(utterance);
    } else {
      speechSynthesis.cancel();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      {/* 오버레이 (배경) */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />
      {/* 패널 본체 (하단 슬라이드 업) */}
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
        <h2 className="text-xl font-bold mb-4">TTS</h2>
        <button onClick={handleToggleTTS} className="px-4 py-2 bg-blue-500 text-white rounded">
          {isPlaying ? "정지" : "재생"}
        </button>
        <div className="mt-4">
          <label className="block mb-1">속도: {rate.toFixed(1)}</label>
          <input
            type="range"
            min={0.5}
            max={2.0}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>
        <div className="mt-4">
          <label className="block mb-1">피치: {pitch.toFixed(1)}</label>
          <input
            type="range"
            min={0.5}
            max={2.0}
            step={0.1}
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>
      </div>
    </>
  );
}
