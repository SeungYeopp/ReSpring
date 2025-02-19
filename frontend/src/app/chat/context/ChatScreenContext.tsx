import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

// Context 값의 타입 정의
interface ChatScreenContextType {
  activeScreen: string;
  setActiveScreen: Dispatch<SetStateAction<string>>;
}

// Context 초기값은 undefined로 설정하고, 나중에 Provider에서 값을 제공하도록 함
const ChatScreenContext = createContext<ChatScreenContextType | undefined>(undefined);

// Provider 컴포넌트의 props 타입 정의
interface ChatScreenProviderProps {
  children: ReactNode;
}

export const ChatScreenProvider = ({ children }: ChatScreenProviderProps) => {
  const [activeScreen, setActiveScreen] = useState("rooms");

  return (
    <ChatScreenContext.Provider value={{ activeScreen, setActiveScreen }}>
      {children}
    </ChatScreenContext.Provider>
  );
};

export const useChatScreenContext = () => {
  const context = useContext(ChatScreenContext);
  if (context === undefined) {
    throw new Error("useChatScreenContext는 ChatScreenProvider 내부에서 사용되어야 합니다.");
  }
  return context;
};
