"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import SockJS from "sockjs-client"
import { Stomp } from "@stomp/stompjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send } from "lucide-react"
import { motion } from "framer-motion"

const SERVER_URL = "http://localhost:8080/chat"
const USER_SESSION_URL = "http://localhost:8080/user/me"

interface ChallengeChatTabProps {
  chatRoomId: string | number;}

export function ChallengeChatTab({ chatRoomId }: ChallengeChatTabProps) {
  const [stompClient, setStompClient] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [message, setMessage] = useState("")
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [userNickname, setUserNickname] = useState("")
  const subscriptionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]) //Fixed: Added 'messages' dependency to ensure scroll after new messages

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await fetch(USER_SESSION_URL, {
          credentials: "include",
        })
        if (!response.ok) throw new Error("Failed to fetch session info")

        const data = await response.json()
        setCurrentUserId(data.userId)
        setUserNickname(data.userNickname)
      } catch (error) {
        console.error("Failed to fetch user info:", error)
        setCurrentUserId(null)
      }
    }

    fetchUserSession()
  }, [])

  // WebSocket 연결
  useEffect(() => {
    if (!currentUserId || !chatRoomId) return

    const socket = new SockJS(SERVER_URL)
    const client = Stomp.over(socket)

    client.connect({}, () => {
      console.log("WebSocket Connected")

      // 채팅방 메시지 구독
      const subscription = client.subscribe(`/topic/messages/${chatRoomId}`, (msg: any) => {
        const newMessage = JSON.parse(msg.body)
        setMessages((prev) => [...prev, newMessage])
      })

      subscriptionRef.current = subscription

      // 초기 메시지 로드
      loadMessages()
    })

    setStompClient(client)

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
      if (client) {
        client.disconnect()
      }
    }
  }, [currentUserId, chatRoomId])

  const loadMessages = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/messages/${chatRoomId}`)
      if (!response.ok) throw new Error("Failed to fetch messages")

      const chatMessages = await response.json()
      setMessages(chatMessages)
    } catch (error) {
      console.error("Failed to load messages:", error)
    }
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() || !stompClient) return

    stompClient.send(
      "/app/chat.sendMessage",
      {},
      JSON.stringify({
        roomId: chatRoomId,
        userId: currentUserId,
        content: message,
      }),
    )
    setMessage("")
  }

  return (
    <Card className="flex flex-col h-full border-none bg-white/50 backdrop-blur-sm shadow-lg">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-gray-900">챌린지 채팅방</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1">
          <div className="flex flex-col space-y-4 p-4">
            {messages.map((msg, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={index}
                className={`flex ${msg.sender === currentUserId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm
                  ${msg.sender === currentUserId ? "bg-[#96b23c] text-white" : "bg-white text-gray-900"}`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-100">
          <form onSubmit={sendMessage} className="flex items-center space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 border-[#96b23c] focus-visible:ring-[#96b23c]"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-[#96b23c] hover:bg-[#7a9431] text-white transition-all duration-300 hover:scale-105"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}

