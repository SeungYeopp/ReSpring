"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { NavigationItemProps } from "./types"
import { Sprout, MessageCircle, Bell, HelpCircle, Pencil, MessageSquare, Target, User } from 'lucide-react'

const IconMap = {
  Sprout,
  MessageCircle,
  Bell,
  HelpCircle,
  Pencil,
  MessageSquare,
  Target,
  User,
}

export function NavigationItem({ label, href, iconName, showLabel = true, className, isLogo = false, isBottomNav = false }: NavigationItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href
  const Icon = IconMap[iconName as keyof typeof IconMap]

  if (!Icon) {
    console.warn(`Icon "${iconName}" not found`)
    return null
  }

  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center transition-colors",
        // 기본 패딩 및 갭 조정
        isBottomNav ? "flex-col justify-center gap-1 px-2 py-1" : "gap-3 p-3",
        // 사이드바 활성 스타일
        isActive && !isLogo && !isBottomNav && "bg-gray-100 border-l-4 border-brand-dark",
        // 바텀내비 활성 스타일
        isActive && !isLogo && isBottomNav && "bg-gray-50/80 border-b-2 border-brand",
        // 로고 스타일
        isLogo ? "text-brand-dark font-bold text-lg" : "text-brand",
        // 바텀내비 컨테이너 스타일
        isBottomNav && "relative w-16 h-14",
        className
      )}
    >
      <Icon 
        className={cn(
          isBottomNav ? "h-5 w-5" : "h-5 w-5",
          isLogo && "h-6 w-6 text-brand-dark",
          isActive && !isLogo && "text-brand-dark"
        )} 
      />
      {showLabel && (
        <span 
          className={cn(
            isBottomNav ? "text-[10px]" : "text-sm",
            isLogo && "text-base font-bold",
            isActive && !isLogo && "text-brand-dark font-medium"
          )}
        >
          {label}
        </span>
      )}
    </Link>
  )
}