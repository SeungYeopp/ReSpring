"use client";

import { createContext, useContext, useState, ReactNode } from "react";

/*
  PanelContext는 전역에서 패널의 열림 상태를 관리하는 컨텍스트입니다.
  기존에는 단순 boolean 상태(isPanelOpen)를 사용했지만,
  여러 패널이 동시에 열릴 수 있는 경우를 대비하여 열려 있는 패널의 수를 관리하도록 변경했습니다.
  
  이 컨텍스트를 통해 페이지 이동이나 툴바 토글 이벤트를 제어할 때,
  하나라도 패널이 열려 있다면(openPanelsCount > 0) 이벤트를 무시하도록 할 수 있습니다.
*/

// PanelContext가 제공할 인터페이스를 정의합니다.
interface PanelContextProps {
  // 현재 열려 있는 패널의 수를 나타내는 상태입니다.
  openPanelsCount: number;
  // 패널이 열릴 때 호출하는 함수입니다. 호출 시 열려 있는 패널의 수를 1 증가시킵니다.
  registerPanel: () => void;
  // 패널이 닫힐 때 호출하는 함수입니다. 호출 시 열려 있는 패널의 수를 1 감소시킵니다.
  unregisterPanel: () => void;
}

// PanelContext를 생성합니다. 초기값은 undefined로 설정하여 Provider로 감싸지지 않은 경우 에러를 발생시킵니다.
const PanelContext = createContext<PanelContextProps | undefined>(undefined);

/*
  PanelProvider 컴포넌트는 하위 컴포넌트들이 PanelContext에 접근할 수 있도록 전역 상태를 제공합니다.
  내부에서는 openPanelsCount 상태와, 패널이 열리거나 닫힐 때 호출할 registerPanel, unregisterPanel 함수를 관리합니다.
*/
export function PanelProvider({ children }: { children: ReactNode }) {
  // openPanelsCount: 현재 열려 있는 패널의 개수를 저장하는 상태입니다.
  const [openPanelsCount, setOpenPanelsCount] = useState(0);

  // registerPanel: 패널이 열릴 때 호출되어 openPanelsCount를 1 증가시킵니다.
  const registerPanel = () => {
    setOpenPanelsCount((prevCount) => prevCount + 1);
  };

  // unregisterPanel: 패널이 닫힐 때 호출되어 openPanelsCount를 1 감소시킵니다.
  // openPanelsCount가 0 미만이 되지 않도록 Math.max를 사용합니다.
  const unregisterPanel = () => {
    setOpenPanelsCount((prevCount) => Math.max(prevCount - 1, 0));
  };

  // Provider를 통해 openPanelsCount와 두 함수를 하위 컴포넌트에 전달합니다.
  return (
    <PanelContext.Provider value={{ openPanelsCount, registerPanel, unregisterPanel }}>
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
