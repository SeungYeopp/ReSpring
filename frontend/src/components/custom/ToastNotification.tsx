"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Bell, MessageSquare, ThumbsUp, UserPlus, Reply, X } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Notification } from "@/app/notifications/types/notifications"

interface ToastNotificationProps {
  notifications: Notification[]
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ notifications }) => {
  const [toast, setToast] = useState<Notification | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const router = useRouter()
  const toastRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef<number | null>(null)

  useEffect(() => {
    if (notifications.length > 0) {
      const newNotification = notifications[notifications.length - 1]
      setToast(newNotification)
      setIsVisible(true)

      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [notifications])

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 300) // 애니메이션 시간

      return () => clearTimeout(timer)
    }
  }, [isVisible])

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

  const getNotificationLink = (targetType: string, targetId: number) => {
    switch (targetType) {
      case "POST":
        return `/today/${targetId}`
      case "BOOK":
        return `/yesterday/book/${targetId}`
      default:
        return "/"
    }
  }

  const markNotificationRead = async (notificationId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      })
      if (!response.ok) throw new Error("알림 읽음 처리 실패")
    } catch (error) {
      console.error(`알림 읽음 처리 실패 (id: ${notificationId})`, error)
    }
  }

  const handleToastClick = async (notification: Notification) => {
    const link = getNotificationLink(notification.targetType, notification.targetId)

    if (!notification.read) {
      await markNotificationRead(notification.id)
    }

    router.push(link)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return

    const touchEndY = e.touches[0].clientY
    const diff = touchStartY.current - touchEndY

    if (diff > 50) {
      // 50px 이상 위로 스와이프하면 사라짐
      setIsVisible(false)
    }
  }

  const handleTouchEnd = () => {
    touchStartY.current = null
  }

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsVisible(false)
  }

  if (!toast) return null

  return (
    <div
      ref={toastRef}
      className={`fixed top-14 left-0 right-0 z-[9999] px-4 md:left-auto md:right-4 md:w-full md:max-w-sm transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        key={toast.id}
        onClick={() => handleToastClick(toast)}
        className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-50"
      >
        <button
          onClick={handleCloseClick}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-4 h-4" />
        </button>
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
    </div>
  )
}

export default ToastNotification

