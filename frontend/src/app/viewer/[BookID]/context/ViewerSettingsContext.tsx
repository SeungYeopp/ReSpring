"use client";

/** 3가지 테마 타입 & 폰트 전역 관리 */

import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

/** 3가지 테마 타입 */
type ThemeType = "basic" | "gray" | "dark";

/** Viewer 설정 Context에 담길 값들 */
interface ViewerSettingsContextProps {
  theme: ThemeType;
  setTheme: Dispatch<SetStateAction<ThemeType>>;

  fontSize: number;
  setFontSize: Dispatch<SetStateAction<number>>;
}

/** Context 생성 */
const ViewerSettingsContext = createContext<ViewerSettingsContextProps | null>(null);

/** Provider: 자식 컴포넌트들이 theme, fontSize를 전역으로 사용 가능하게 함 */
export function ViewerSettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>("basic"); // 기본 테마: basic
  const [fontSize, setFontSize] = useState<number>(16); // 기본 폰트 크기: 16px

  const value: ViewerSettingsContextProps = {
    theme,
    setTheme,
    fontSize,
    setFontSize,
  };

  return <ViewerSettingsContext.Provider value={value}>{children}</ViewerSettingsContext.Provider>;
}

/** 훅: Context를 쉽게 쓰도록 도와줌 */
export function useViewerSettings() {
  const context = useContext(ViewerSettingsContext);
  if (!context) {
    throw new Error("useViewerSettings must be used within <ViewerSettingsProvider>!");
  }
  return context;
}
