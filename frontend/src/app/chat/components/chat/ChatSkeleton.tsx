"use client"

import { CustomSkeleton } from "../ui/chat-custom-skeleton"
import { useTheme } from "../../contexts/ChatThemeContext"
import { themeColors } from "../../types/chatTheme"

export function ChatSkeleton() {
  const { theme } = useTheme()

  return (
    <div className={`flex flex-col h-full ${themeColors[theme].background}`}>
      <div className={`flex items-center p-4 border-b ${themeColors[theme].border}`}>
        <CustomSkeleton className="h-12 w-12 rounded-full" />
        <CustomSkeleton className="h-6 w-48 ml-3" />
      </div>
      <div className={`flex-1 p-4 space-y-6 overflow-y-auto ${themeColors[theme].background}`}>
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-[85%] ${i % 2 === 0 ? "rounded-br-none" : "rounded-bl-none"}`}>
              <CustomSkeleton className={`h-16 ${i % 2 === 0 ? "w-[300px]" : "w-[350px]"}`} />
              <CustomSkeleton className="h-4 w-24 mt-2" />
            </div>
          </div>
        ))}
      </div>
      <div className={`p-4 border-t ${themeColors[theme].border}`}>
        <CustomSkeleton className="h-12 w-full" />
      </div>
    </div>
  )
}

