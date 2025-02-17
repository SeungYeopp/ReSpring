"use client";

import { createContext, useContext, useState, ReactNode } from "react";

/*
  PanelContext는 전역에서 패널의 열림 상태를 관리하는 컨텍스트입니다.
  이전에는 단순히 열려 있는 패널의 수(openPanelsCount)를 관리했지만,
  이제는 한 번에 하나의 패널만 열리도록 하기 위해,
  현재 열려 있는 패널의 고유 ID(currentOpenPanel)를 관리합니다.
  
  이 컨텍스트를 통해 페이지 이동이나 툴바 토글 이벤트를 제어할 때,
  만약 currentOpenPanel이 null이 아니라면(즉, 어떤 패널이 열려 있다면)
  이벤트를 무시하도록 할 수 있습니다.
*/

// PanelContext가 제공할 인터페이스를 정의합니다.
interface PanelContextProps {
  // 현재 열려 있는 패널의 고유 ID를 나타내며, 패널이 열려 있지 않으면 null입니다.
  currentOpenPanel: string | null;
  // 새로운 패널을 열 때 호출하는 함수입니다. panelId를 인자로 받아 해당 패널을 열도록 합니다.
  openPanel: (panelId: string) => void;
  // 패널을 닫을 때 호출하는 함수입니다. currentOpenPanel을 null로 설정합니다.
  closePanel: () => void;
}

// PanelContext를 생성합니다. 초기값은 undefined로 설정하여 Provider로 감싸지지 않은 경우 에러를 발생시킵니다.
const PanelContext = createContext<PanelContextProps | undefined>(undefined);

/*
  PanelProvider 컴포넌트는 하위 컴포넌트들이 PanelContext에 접근할 수 있도록 전역 상태를 제공합니다.
  내부에서는 currentOpenPanel 상태와, 패널을 열거나 닫을 때 호출할 openPanel, closePanel 함수를 관리합니다.
*/
export function PanelProvider({ children }: { children: ReactNode }) {
  // currentOpenPanel: 현재 열려 있는 패널의 고유 ID를 저장하는 상태입니다.
  // 패널이 열려 있지 않으면 null을 저장합니다.
  const [currentOpenPanel, setCurrentOpenPanel] = useState<string | null>(null);

  // openPanel: 새로운 패널을 열 때 호출되어 currentOpenPanel을 해당 패널의 ID로 설정합니다.
  // 만약 이미 다른 패널이 열려 있다면, 이를 덮어쓰게 됩니다.
  const openPanel = (panelId: string) => {
    setCurrentOpenPanel(panelId);
  };

  // closePanel: 패널이 닫힐 때 호출되어 currentOpenPanel을 null로 설정합니다.
  const closePanel = () => {
    setCurrentOpenPanel(null);
  };

  // Provider를 통해 currentOpenPanel과 두 함수를 하위 컴포넌트에 전달합니다.
  return (
    <PanelContext.Provider value={{ currentOpenPanel, openPanel, closePanel }}>
      {children}
    </PanelContext.Provider>
  );
}

/*
  usePanelContext 커스텀 훅은 PanelContext를 쉽게 사용할 수 있도록 도와줍니다.
  만약 이 훅을 호출한 컴포넌트가 PanelProvider 하위에 존재하지 않으면 에러를 발생시킵니다.
*/
export function usePanelContext() {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error("usePanelContext must be used within a PanelProvider");
  }
  return context;
}
