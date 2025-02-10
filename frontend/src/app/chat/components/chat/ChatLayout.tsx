"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "../../hooks/chatUseMediaQuery";
import type React from "react";
import { ThemeProvider } from "../../contexts/ChatThemeContext";
import ChatList from "./ChatList";

type ChatLayoutProps = {
  children: React.ReactNode;
  showChatList?: boolean;
};

export default function ChatLayout({ children, showChatList = true }: ChatLayoutProps) {
  const [isMobileView, setIsMobileView] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setIsMobileView(isMobile);
  }, [isMobile]);

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background">
        {isMobileView ? (
          // 모바일 레이아웃
          <div className="w-full h-full">{children}</div>
        ) : (
          // 데스크탑 레이아웃
          <>
            <div className="w-1/3 h-full border-r md:-my-4">
              <ChatList />
            </div>
            <div className="w-2/3 h-full md:-my-4">{children}</div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
}
