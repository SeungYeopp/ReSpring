"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "./types";
import { Sprout, MessageCircle, Bell, HelpCircle, Pencil, MessageSquare, Target, User } from "lucide-react";

const IconMap = {
  Sprout,
  MessageCircle,
  Bell,
  HelpCircle,
  Pencil,
  MessageSquare,
  Target,
  User,
};

interface NavItemProps extends NavItem {
  showLabel?: boolean;
  className?: string;
}

export function NavigationItem({ label, href, iconName, showLabel = true, className, isLogo = false }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const Icon = IconMap[iconName as keyof typeof IconMap];

  if (!Icon) {
    console.warn(`Icon "${iconName}" not found`);
    return null;
  }

  return (
    <Link href={href} className={cn("flex items-center gap-3 p-3 transition-colors rounded-md", isActive ? "text-brand-dark" : "text-brand", isLogo && "font-bold text-lg", className)}>
      <Icon className={cn("h-5 w-5", isLogo && "h-6 w-6", isActive && "text-brand-dark")} />
      {showLabel && <span className={cn("text-sm", isLogo && "text-base", isActive && "text-brand-dark")}>{label}</span>}
    </Link>
  );
}
