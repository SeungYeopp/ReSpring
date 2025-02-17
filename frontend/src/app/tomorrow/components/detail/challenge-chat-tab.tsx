"use client"

import { useState, useRef, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { OpenChatMessage } from "../../types/OpenChat"
import { type Theme, themeColors } from "../../types/theme"
import dynamic from "next/dynamic"
import { Send, Smile, Settings, Plus, Minus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { leaveChallenge } from "@/lib/api"
import type { ParticipantListResponse } from "../../types/Participants"
import { ParticipantListModal } from "./participant-list-modal"

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false })

// 임시 데이터
const MOCK_MESSAGES: OpenChatMessage[] = [
  {
    id: "1",
    userId: "user1",
    nickname: "홍길동",
    content: "오늘도 화이팅하세요! 👊",
    timestamp: "2025-02-09T09:00:00.000Z",
  },
  {
    id: "2",
    userId: "user2",
    nickname: "김철수",
    content: "저도 오늘 목표 달성했어요! 😊",
    timestamp: "2025-02-09T09:01:00.000Z",
  },
]

export function ChallengeChatTab() {
  const [messages, setMessages] = useState<OpenChatMessage[]>(MOCK_MESSAGES)
  const [newMessage, setNewMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [font, setFont] = useState("sans")
  const [fontSize, setFontSize] = useState(16)
  const [theme, setTheme] = useState<Theme>("light")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const [isParticipating, setIsParticipating] = useState(false)
  const [isTodayCompleted, setIsTodayCompleted] = useState(false)
  const [isParticipantListOpen, setIsParticipantListOpen] = useState(false)
  const [participantList, setParticipantList] = useState<ParticipantListResponse | null>(null)

  const handleCompleteToday = () => {
    setIsTodayCompleted(true)
    console.log("오늘의 도전 완료 API 호출")
  }

  const currentUserId = "user1"

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem("chatTheme") as Theme | null
    const themeValues: Theme[] = ["light", "dark", "spring", "summer"] // 테마 값 배열로 정의

    if (savedTheme && themeValues.includes(savedTheme)) {
      setTheme(savedTheme)
    } else {
      setTheme("light")
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const newMsg: OpenChatMessage = {
        id: Date.now().toString(),
        userId: currentUserId,
        nickname: "홍길동",
        content: newMessage,
        timestamp: new Date().toISOString(),
      }
      setMessages([...messages, newMsg])
      setNewMessage("")
    }
  }

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji)
    setShowEmojiPicker(false)
  }

  const handleLeaveChallenge = async () => {
    try {
      const challengeId = Number("챌린지_ID") // 문자열을 숫자로 변환

      if (isNaN(challengeId)) {
        throw new Error("유효하지 않은 챌린지 ID입니다.")
      }

      const success = await leaveChallenge(challengeId)
      if (success) {
        console.log("챌린지 나가기 성공")
        setIsParticipating(false)
      }
    } catch (error) {
      console.error("챌린지 나가기 실패:", error)
    }
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("chatTheme", newTheme)
  }

  const handleFontSizeChange = (increment: boolean) => {
    setFontSize((prev) => {
      const newSize = increment ? prev + 1 : prev - 1
      return Math.min(Math.max(newSize, 12), 24)
    })
  }

  const handleJoinChallenge = async () => {
    try {
      console.log("챌린지 참여 API 호출")
      setIsParticipating(true)
    } catch (error) {
      console.error("챌린지 참여 중 오류 발생:", error)
    }
  }

  const handleParticipantListClick = async () => {
    try {
      // 실제 구현에서는 여기에 API 호출이 들어갈 것입니다
      const response: ParticipantListResponse = {
        challengeId: 1, // Replace with actual challenge ID
        participantCount: 10, // Replace with actual count
        participants: [
          {
            userId: "dd5a7b3c-d887-11ef-b310-d4f32d147183",
            nickname: "홍길동",
            profileImage: "http://example.com/profile.jpg",
          },
          {
            userId: "ff6b8c4d-d99f-11ef-b310-d4f32d147183",
            nickname: "김철수",
            profileImage: "http://example.com/profile2.jpg",
          },
        ],
      }
      setParticipantList(response)
      setIsParticipantListOpen(true)
    } catch (error) {
      console.error("Failed to fetch participant list:", error)
    }
  }

  return (
    <div
      className={`h-full flex flex-col bg-background ${themeColors[theme].background} ${themeColors[theme].text}`}
      style={{ height: "100%" }}
    >
      <div
        className={`py-3 px-4 border-b flex flex-row items-center justify-between ${themeColors[theme].background} ${themeColors[theme].text}`}
      >
          <Button
            variant="outline"
            size="sm"
            onClick={handleParticipantListClick}
            className={`mr-2 text-xs lg:text-sm ${themeColors[theme].background} ${themeColors[theme].text} hover:${themeColors[theme].background}`}
          >
            <Users className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
            참여자 목록
          </Button>        <div className="flex items-center">

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className={`hover:${themeColors[theme].secondary}`}>
                <Settings className={`h-5 w-5 ${themeColors[theme].text}`} />
                <span className="sr-only">설정</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className={`w-72 ${themeColors[theme].background} ${themeColors[theme].text}`}
              align="end"
              side="bottom"
            >
              <div className="grid gap-3">
                <div className="grid grid-cols-12 items-center gap-2">
                  <label htmlFor="theme" className="col-span-4">
                    테마
                  </label>
                  <div className="col-span-8">
                    <Select onValueChange={handleThemeChange} value={theme}>
                      <SelectTrigger
                        id="theme"
                        className={`w-full min-w-[8rem] ${themeColors[theme].background} ${themeColors[theme].text}`}
                      >
                        <SelectValue placeholder="테마 선택" />
                      </SelectTrigger>
                      <SelectContent
                        className={`${themeColors[theme].background} ${themeColors[theme].text} min-w-[8rem] w-full`}
                      >
                        <SelectItem value="light">라이트 모드</SelectItem>
                        <SelectItem value="dark">다크 모드</SelectItem>
                        <SelectItem value="spring">봄</SelectItem>
                        <SelectItem value="summer">여름</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-12 items-center gap-2">
                  <label htmlFor="font" className="col-span-4">
                    폰트
                  </label>
                  <div className="col-span-8">
                    <Select onValueChange={setFont} value={font}>
                      <SelectTrigger
                        id="font"
                        className={`w-full min-w-[8rem] ${themeColors[theme].background} ${themeColors[theme].text}`}
                      >
                        <SelectValue placeholder="폰트 선택" />
                      </SelectTrigger>
                      <SelectContent
                        className={`${themeColors[theme].background} ${themeColors[theme].text} min-w-[8rem] w-full`}
                      >
                        <SelectItem value="sans">Sans-serif</SelectItem>
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="mono">Monospace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-12 items-center gap-2">
                  <label htmlFor="fontSize" className="col-span-4">
                    글자 크기
                  </label>
                  <div className="col-span-8 flex items-center justify-between gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleFontSizeChange(false)}
                      disabled={fontSize <= 12}
                      className={`h-8 w-8 ${themeColors[theme].background} ${themeColors[theme].text}`}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="min-w-[3ch] text-center">{fontSize}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleFontSizeChange(true)}
                      disabled={fontSize >= 24}
                      className={`h-8 w-8 ${themeColors[theme].background} ${themeColors[theme].text}`}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button onClick={handleLeaveChallenge} variant="destructive" className="w-full">
                  챌린지 나가기
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <div className={`space-y-4 ${themeColors[theme].background}`}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.userId === currentUserId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.userId === currentUserId
                    ? `${themeColors[theme].primary} text-white rounded-br-none`
                    : `${themeColors[theme].secondary} ${themeColors[theme].text} rounded-bl-none`
                }`}
                style={{
                  fontFamily: font === "sans" ? "sans-serif" : font === "serif" ? "serif" : "monospace",
                  fontSize: `${fontSize}px`,
                }}
              >
                {message.userId !== currentUserId && <p className="text-xs font-medium mb-1">{message.nickname}</p>}
                <p className="break-words">{message.content}</p>
                <div
                  className={`text-xs mt-1 text-right ${message.userId === currentUserId ? "text-white/80" : `${themeColors[theme].text} opacity-80`}`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className={`p-4 border-t ${themeColors[theme].background}`}>
        <div className="flex w-full space-x-2">
          <div className="relative flex-grow">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex space-x-2 w-full"
            >
              <Input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className={`flex-grow ${themeColors[theme].background} ${themeColors[theme].text}`}
              />
              {showEmojiPicker && (
                <div ref={emojiPickerRef} className="absolute left-0 bottom-full mb-2">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`px-2 ${themeColors[theme].background} ${themeColors[theme].text}`}
              >
                <Smile className="h-5 w-5" />
              </Button>
              <Button
                type="submit"
                className={`${themeColors[theme].primary} hover:${themeColors[theme].primary} text-white`}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
      {/* <ChallengeActionButton isParticipating={isParticipating} isTodayCompleted={isTodayCompleted} theme={theme} onComplete={handleCompleteToday} onJoin={handleJoinChallenge} /> */}
      {participantList && (
  <ParticipantListModal
    isOpen={isParticipantListOpen}
    onClose={() => setIsParticipantListOpen(false)}
    challengeId={participantList.challengeId} // participants 대신 challengeId 전달
    theme={theme}
  />
)}
    </div>
  )
}

