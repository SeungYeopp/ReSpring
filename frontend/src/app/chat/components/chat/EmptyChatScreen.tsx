"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import NewMessageModal from "./NewMessageModal"
import { useTheme } from "../../contexts/ChatThemeContext"
import { themeColors } from "../../types/chatTheme"

export default function EmptyChatScreen() {
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false)
  const { theme } = useTheme()

  return (
    <div
      className={`flex flex-col items-center justify-center h-full ${themeColors[theme].background} ${themeColors[theme].text}`}
    >
      <MessageCircle className={`w-16 h-16 mb-4 ${themeColors[theme].mutedText}`} />
      <h2 className="text-2xl font-semibold mb-2">내 메시지</h2>
      <p className={`${themeColors[theme].mutedText} mb-4`}>친구나 그룹에 비공개 사진과 메시지를 보내보세요.</p>
      <Button onClick={() => setIsNewMessageModalOpen(true)} className={themeColors[theme].primary}>
        메시지 보내기
      </Button>
      <NewMessageModal isOpen={isNewMessageModalOpen} onClose={() => setIsNewMessageModalOpen(false)} theme={theme}/>
    </div>
  )
}

