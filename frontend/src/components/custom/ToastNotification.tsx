"use client"

import React, { useEffect, useState } from "react"  // 여기서 'import type'을 'import'로 변경
import { Bell, MessageSquare, ThumbsUp, UserPlus, Reply } from "lucide-react"

interface Notification {
  id: string | number
  message: string
  type: "COMMENT" | "LIKE" | "SUBSCRIBE" | "REPLY" | "DEFAULT"
  createdAt: string | Date
}

interface ToastNotificationProps {
  notifications: Notification[]
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ notifications }) => {
  const [toasts, setToasts] = useState<Notification[]>([])

  useEffect(() => {
    if (notifications.length > 0) {
      setToasts((prev) => [...prev, notifications[notifications.length - 1]])

      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1))
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [notifications])

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "COMMENT":
        return <MessageSquare className="w-4 h-4 text-blue-500" />
      case "LIKE":
        return <ThumbsUp className="w-4 h-4 text-red-500" />
      case "SUBSCRIBE":
        return <UserPlus className="w-4 h-4 text-green-500" />
      case "REPLY":
        return <Reply className="w-4 h-4 text-purple-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="fixed top-14 right-4 z-[9999] space-y-2 max-w-sm w-full">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out"
          style={{
            opacity: 1 - index * 0.2,
            transform: `translateY(${index * 10}px)`,
          }}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">{getNotificationIcon(toast.type)}</div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{toast.message}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {new Date(toast.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ToastNotification
