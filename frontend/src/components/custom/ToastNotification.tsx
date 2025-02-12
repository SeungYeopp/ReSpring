"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Bell, MessageSquare, ThumbsUp, UserPlus, Reply, X } from "lucide-react"

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
  const [currentToast, setCurrentToast] = useState<Notification | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const toastRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1]
      setCurrentToast(latestNotification)
      setIsVisible(true)
      setCurrentY(0)

      const timer = setTimeout(() => {
        setIsVisible(false)
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

  const removeToast = () => {
    setIsVisible(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaY = startY - e.touches[0].clientY
    if (deltaY > 0) {
      setCurrentY(-deltaY)
    }
  }

  const handleTouchEnd = () => {
    if (currentY < -50) {
      setIsVisible(false)
    } else {
      setCurrentY(0)
    }
  }

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        setCurrentToast(null)
      }, 300) // 트랜지션 시간과 일치
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  if (!currentToast) return null

  return (
    <div className="fixed top-14 right-0 left-0 sm:right-4 sm:left-auto z-[9999] w-full sm:max-w-sm px-4 sm:px-0">
      <div
        ref={toastRef}
        className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out relative ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
        }`}
        style={{ transform: `translateY(${currentY}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button
          onClick={removeToast}
          className="absolute top-1 right-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start pr-6">
          <div className="flex-shrink-0">{getNotificationIcon(currentToast.type)}</div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{currentToast.message}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {new Date(currentToast.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToastNotification

