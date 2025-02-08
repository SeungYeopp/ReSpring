"use client"

import { useState } from "react"
import { useViewerSettings } from "../context/ViewerSettingsContext"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SettingsPanel() {
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    lineHeight,
    setLineHeight,
    letterSpacing,
    setLetterSpacing,
    pageTransition,
    setPageTransition,
  } = useViewerSettings()
  const [isOpen, setIsOpen] = useState(false)

  const togglePanel = () => {
    setIsOpen((prev) => !prev)
  }

  const getThemeClasses = () => {
    switch (theme) {
      case "basic":
        return "bg-white text-black border-gray-400"
      case "gray":
        return "bg-gray-800 text-white border-gray-600"
      case "dark":
        return "bg-black text-white border-gray-800"
    }
  }

  const getButtonClasses = (currentValue: string, expectedValue: string) => {
    const baseClasses = "px-3 py-1 rounded border"
    const activeClasses = theme === "basic" ? "bg-gray-300 text-black" : "bg-gray-600 text-white"
    return `${baseClasses} ${currentValue === expectedValue ? activeClasses : "bg-transparent"}`
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={togglePanel} className="fixed top-2 right-4">
        <Settings className="h-5 w-5" />
      </Button>

      {isOpen && <div className="fixed inset-0 bg-black/40 transition-opacity" onClick={togglePanel} />}

      <div
        className={`fixed top-0 left-0 w-full p-4 shadow-lg transition-transform duration-300 ease-in-out rounded-b-lg border-2 ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        } ${getThemeClasses()}`}
      >
        <h2 className="text-xl font-bold mb-4">설정</h2>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">테마</label>
          <div className="flex gap-2">
            <button onClick={() => setTheme("basic")} className={getButtonClasses(theme, "basic")}>
              기본
            </button>
            <button onClick={() => setTheme("gray")} className={getButtonClasses(theme, "gray")}>
              그레이
            </button>
            <button onClick={() => setTheme("dark")} className={getButtonClasses(theme, "dark")}>
              다크
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">글자 크기</label>
          <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(Number(value))}>
            <SelectTrigger
              className={`w-full ${
                theme === "basic"
                  ? "bg-white border-gray-200"
                  : theme === "gray"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-black border-gray-800"
              }`}
            >
              <SelectValue placeholder="글자 크기 선택" />
            </SelectTrigger>
            <SelectContent
              className={`${
                theme === "basic"
                  ? "bg-white border-gray-200"
                  : theme === "gray"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-black border-gray-800"
              } ${theme === "basic" ? "text-gray-900" : "text-gray-100"}`}
            >
              {[12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
                <SelectItem
                  key={size}
                  value={size.toString()}
                  className={`${
                    theme === "basic"
                      ? "hover:bg-gray-100"
                      : theme === "gray"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-900"
                  }`}
                >
                  {size}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">줄 간격</label>
          <Select value={lineHeight.toString()} onValueChange={(value) => setLineHeight(Number(value))}>
            <SelectTrigger
              className={`w-full ${
                theme === "basic"
                  ? "bg-white border-gray-200"
                  : theme === "gray"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-black border-gray-800"
              }`}
            >
              <SelectValue placeholder="줄 간격 선택" />
            </SelectTrigger>
            <SelectContent
              className={`${
                theme === "basic"
                  ? "bg-white border-gray-200"
                  : theme === "gray"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-black border-gray-800"
              } ${theme === "basic" ? "text-gray-900" : "text-gray-100"}`}
            >
              {[1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4].map((height) => (
                <SelectItem
                  key={height}
                  value={height.toString()}
                  className={`${
                    theme === "basic"
                      ? "hover:bg-gray-100"
                      : theme === "gray"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-900"
                  }`}
                >
                  {height.toFixed(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">자간</label>
          <Select value={letterSpacing.toString()} onValueChange={(value) => setLetterSpacing(Number(value))}>
            <SelectTrigger
              className={`w-full ${
                theme === "basic"
                  ? "bg-white border-gray-200"
                  : theme === "gray"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-black border-gray-800"
              }`}
            >
              <SelectValue placeholder="자간 선택" />
            </SelectTrigger>
            <SelectContent
              className={`${
                theme === "basic"
                  ? "bg-white border-gray-200"
                  : theme === "gray"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-black border-gray-800"
              } ${theme === "basic" ? "text-gray-900" : "text-gray-100"}`}
            >
              {[-1, -0.5, 0, 0.5, 1, 1.5, 2].map((spacing) => (
                <SelectItem
                  key={spacing}
                  value={spacing.toString()}
                  className={`${
                    theme === "basic"
                      ? "hover:bg-gray-100"
                      : theme === "gray"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-900"
                  }`}
                >
                  {spacing.toFixed(1)}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">페이지 넘김 효과</label>
          <div className="flex gap-2">
            <button onClick={() => setPageTransition("none")} className={getButtonClasses(pageTransition, "none")}>
              기본
            </button>
            <button onClick={() => setPageTransition("fade")} className={getButtonClasses(pageTransition, "fade")}>
              페이드
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

