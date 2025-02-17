import { logout } from "@/lib/api";
import type { NavItem } from "./types";

// 상단 네비게이션 아이템 (모바일용)
export const topNavItems: NavItem[] = [
  { label: "홈", href: "/", iconName: "Sprout", isAction: true, isLogo: true },
  { label: "채팅", href: "/chat", iconName: "MessageCircle", isAction: true },
  { label: "알림", href: "/notifications", iconName: "Bell", isAction: true },
  { label: "도움말", href: "/help", iconName: "HelpCircle", isAction: true },
  {
    label: "로그아웃",
    href: "#",
    iconName: "LogOut",
    isAction: true,
    onClick: async (event) => {
      event.preventDefault();
      try {
        const success = await logout();
        if (success) {
          window.location.href = "/";
        } else {
          console.error("Logout failed");
        }
      } catch (error) {
        console.error("Error logging out:", error);
      }
    },
  },
];

// 사이드바 네비게이션 아이템 (데스크탑용)
export const sidebarItems: NavItem[] = [
  { label: "다시, 봄(Re:Spring)", href: "/", iconName: "Sprout", isLogo: true },
  { label: "어제", href: "/yesterday", iconName: "Bean" },
  { label: "오늘", href: "/today", iconName: "Sprout" },
  { label: "내일", href: "/tomorrow", iconName: "Flower2" },
  { label: "나의 봄", href: "/profile", iconName: "User" },
  { label: "채팅", href: "/chat", iconName: "MessageCircle", isAction: true },
  { label: "알림", href: "/notifications", iconName: "Bell", isAction: true },
  { label: "도움말", href: "/help", iconName: "HelpCircle", isAction: true },
  {
    label: "로그아웃",
    href: "#",
    iconName: "LogOut",
    isAction: true,
    onClick: async (event) => {
      event.preventDefault();
      try {
        const success = await logout();
        if (success) {
          window.location.href = "/";
        } else {
          console.error("Logout failed");
        }
      } catch (error) {
        console.error("Error logging out:", error);
      }
    },
  },
];

// 하단 네비게이션 아이템 (모바일용)
export const bottomNavItems: NavItem[] = [
  { label: "어제", href: "/yesterday", iconName: "Bean" },
  { label: "오늘", href: "/today", iconName: "Sprout" },
  { label: "내일", href: "/tomorrow", iconName: "Flower2" },
  { label: "나의 봄", href: "/profile", iconName: "User" },
];
