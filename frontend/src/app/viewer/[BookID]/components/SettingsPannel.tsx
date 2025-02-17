"use client";

// React 훅들을 import합니다.
import { useState, useEffect } from "react"; // useState와 useEffect를 import합니다.
import { usePanelContext } from "../context/usePanelContext"; // 전역 패널 상태에 접근하기 위한 커스텀 훅을 가져옵니다.
import { useViewerSettings } from "../context/ViewerSettingsContext"; // 뷰어 설정 관련 상태와 함수를 가져옵니다.
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/*
  SettingsPanel 컴포넌트는 뷰어 설정 관련 컨텍스트(ViewerSettingsContext)와
  패널 전역 상태(PanelContext)를 함께 사용합니다.
  
  이 컴포넌트는 패널의 열림 여부를 로컬 상태와 전역 상태(currentOpenPanel)를 함께 관리하여,
  패널 열림 시 전역에서 페이지 이동 이벤트를 무시하고, 
  한 번에 하나의 패널만 열리도록 합니다.
  
  여기서는 자신의 고유 ID "settings"를 전역 패널 상태에 등록하여 관리합니다.
*/
export function SettingsPanel() {
  // PanelContext에서 현재 열린 패널의 ID와, 패널을 열거나 닫기 위한 함수를 가져옵니다.
  const { currentOpenPanel, openPanel, closePanel } = usePanelContext();

  // ViewerSettingsContext에서 설정 관련 상태와 함수를 가져옵니다.
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
    fontFamily,
    setFontFamily,
  } = useViewerSettings();

  // 로컬 상태: 패널의 열림 여부(애니메이션 및 렌더링 제어용)
  const [isOpen, setIsOpen] = useState(false);

  /*
    useEffect: 전역 패널 상태(currentOpenPanel)를 감시합니다.
    만약 현재 이 SettingsPanel이 열려있는데(currentOpenPanel가 "settings"여야 함),
    다른 패널이 열리면 자동으로 자신의 로컬 상태를 닫아(즉, isOpen을 false로 설정) 패널을 숨깁니다.
  */
  useEffect(() => {
    if (isOpen && currentOpenPanel !== "settings") {
      setIsOpen(false);
    }
  }, [currentOpenPanel, isOpen]);

  /*
    패널 토글 함수: 사용자가 버튼을 클릭하면 호출됩니다.
    - 만약 패널을 열면, 자신의 고유 ID "settings"를 전역 패널 상태에 등록합니다.
    - 만약 패널을 닫으면, 전역 패널 상태를 해제합니다.
  */
  const togglePanel = () => {
    setIsOpen((prev: boolean) => {
      const newState = !prev;
      if (newState) {
        // 패널이 열리면 자신의 ID "settings"를 전역 패널 상태에 등록합니다.
        openPanel("settings");
      } else {
        // 패널이 닫히면 전역 패널 상태를 해제합니다.
        closePanel();
      }
      return newState;
    });
  };

  /*
    테마에 따른 CSS 클래스 결정 함수:
    현재 설정된 테마에 따라 배경, 글자 색상, 테두리 색상을 결정합니다.
  */
  const getThemeClasses = () => {
    switch (theme) {
      case "basic":
        return "bg-white text-black border-gray-400";
      case "gray":
        return "bg-gray-800 text-white border-gray-600";
      case "dark":
        return "bg-black text-white border-gray-800";
    }
  };

  /*
    버튼 활성화/비활성화 클래스 결정 함수:
    현재 값과 기대하는 값이 일치하면 활성화 스타일을 적용하고,
    그렇지 않으면 기본 스타일을 적용합니다.
  */
  const getButtonClasses = (currentValue: string, expectedValue: string) => {
    const baseClasses = "px-3 py-1 rounded border";
    const activeClasses = theme === "basic" ? "bg-gray-300 text-black" : "bg-gray-600 text-white";
    return `${baseClasses} ${currentValue === expectedValue ? activeClasses : "bg-transparent"}`;
  };

  return (
    <>
      {/* 설정 패널을 여는 버튼 (오른쪽 상단 고정) */}
      <Button variant="ghost" size="icon" onClick={togglePanel} className="fixed top-2 right-4">
        <Settings className="h-5 w-5" />
      </Button>

      {/* 오버레이: 클릭 시 패널 닫힘 */}
      {isOpen && <div className="fixed inset-0 bg-black/40 transition-opacity" onClick={togglePanel} />}

      {/* 설정 패널 자체 */}
      <div
        className={`fixed top-0 left-0 w-full p-4 shadow-lg transition-transform duration-300 ease-in-out rounded-b-lg border-2 
          ${isOpen ? "translate-y-0" : "-translate-y-full"} ${getThemeClasses()}`}
      >
        <h2 className="text-xl font-bold mb-4">설정</h2>

        {/* 글꼴 선택 */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">글꼴 선택</label>
          <Select value={fontFamily} onValueChange={setFontFamily}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="글꼴 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="font-godob">고도 B</SelectItem>
              <SelectItem value="font-godom">고도 M</SelectItem>
              <SelectItem value="font-godomaum">고도 마음체</SelectItem>
              <SelectItem value="font-nunugothic">누누 고딕</SelectItem>
              <SelectItem value="font-samlipbasic">삼립 베이직</SelectItem>
              <SelectItem value="font-samlipoutline">삼립 아웃라인</SelectItem>
              <SelectItem value="font-ongle">온글잎 박다현체</SelectItem>
              <SelectItem value="font-binggraetaom">빙그레 타옴</SelectItem>
              <SelectItem value="font-binggraetaombold">빙그레 타옴 볼드</SelectItem>
              <SelectItem value="font-mapobackpacking">마포 백패킹</SelectItem>
              <SelectItem value="font-goodneighborsbold">좋은이웃 볼드</SelectItem>
              <SelectItem value="font-goodneighborsregular">좋은이웃 레귤러</SelectItem>
              <SelectItem value="font-laundrygothicbold">런드리 고딕 볼드</SelectItem>
              <SelectItem value="font-laundrygothicregular">런드리 고딕 레귤러</SelectItem>
              <SelectItem value="font-handon300">한돈 300g</SelectItem>
              <SelectItem value="font-handon600">한돈 600g</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 테마 설정 */}
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

        {/* 글자 크기 설정 */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">글자 크기</label>
          <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(Number(value))}>
            <SelectTrigger
              className={`w-full ${
                theme === "basic" ? "bg-white border-gray-200" : theme === "gray" ? "bg-gray-800 border-gray-700" : "bg-black border-gray-800"
              }`}
            >
              <SelectValue placeholder="글자 크기 선택" />
            </SelectTrigger>
            <SelectContent
              className={`${theme === "basic" ? "bg-white border-gray-200" : theme === "gray" ? "bg-gray-800 border-gray-700" : "bg-black border-gray-800"} ${
                theme === "basic" ? "text-gray-900" : "text-gray-100"
              }`}
            >
              {[12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
                <SelectItem
                  key={size}
                  value={size.toString()}
                  className={`${theme === "basic" ? "hover:bg-gray-100" : theme === "gray" ? "hover:bg-gray-700" : "hover:bg-gray-900"}`}
                >
                  {size}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 줄 간격 설정 */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">줄 간격</label>
          <Select value={lineHeight.toString()} onValueChange={(value) => setLineHeight(Number(value))}>
            <SelectTrigger
              className={`w-full ${
                theme === "basic" ? "bg-white border-gray-200" : theme === "gray" ? "bg-gray-800 border-gray-700" : "bg-black border-gray-800"
              }`}
            >
              <SelectValue placeholder="줄 간격 선택" />
            </SelectTrigger>
            <SelectContent
              className={`${theme === "basic" ? "bg-white border-gray-200" : theme === "gray" ? "bg-gray-800 border-gray-700" : "bg-black border-gray-800"} ${
                theme === "basic" ? "text-gray-900" : "text-gray-100"
              }`}
            >
              {[1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4].map((height) => (
                <SelectItem
                  key={height}
                  value={height.toString()}
                  className={`${theme === "basic" ? "hover:bg-gray-100" : theme === "gray" ? "hover:bg-gray-700" : "hover:bg-gray-900"}`}
                >
                  {height.toFixed(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 자간 설정 */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">자간</label>
          <Select value={letterSpacing.toString()} onValueChange={(value) => setLetterSpacing(Number(value))}>
            <SelectTrigger
              className={`w-full ${
                theme === "basic" ? "bg-white border-gray-200" : theme === "gray" ? "bg-gray-800 border-gray-700" : "bg-black border-gray-800"
              }`}
            >
              <SelectValue placeholder="자간 선택" />
            </SelectTrigger>
            <SelectContent
              className={`${theme === "basic" ? "bg-white border-gray-200" : theme === "gray" ? "bg-gray-800 border-gray-700" : "bg-black border-gray-800"} ${
                theme === "basic" ? "text-gray-900" : "text-gray-100"
              }`}
            >
              {[-1, -0.5, 0, 0.5, 1, 1.5, 2].map((spacing) => (
                <SelectItem
                  key={spacing}
                  value={spacing.toString()}
                  className={`${theme === "basic" ? "hover:bg-gray-100" : theme === "gray" ? "hover:bg-gray-700" : "hover:bg-gray-900"}`}
                >
                  {spacing.toFixed(1)}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 페이지 넘김 효과 설정 */}
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
  );
}
