"use client";

import type React from "react"; // Import React
import { cn } from "@/lib/utils";
import { useTheme } from "../../contexts/ChatThemeContext";
import { themeColors } from "../../types/chatTheme";

interface CustomSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function CustomSkeleton({ className, ...props }: CustomSkeletonProps) {
  const { theme } = useTheme();

  return <div className={cn("animate-pulse rounded-md", themeColors[theme].skeleton, className)} {...props} />;
}
