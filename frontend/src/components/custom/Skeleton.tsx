// src/components/custom/Sekleton.tsx

import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
}

export function CustomSkeleton({ width = "100%", height = "1rem", rounded = "md", className = "", ...props }: SkeletonProps) {
  return <div className={cn("animate-pulse bg-gray-300", `rounded-${rounded}`, className)} style={{ width, height }} {...props} />;
}
