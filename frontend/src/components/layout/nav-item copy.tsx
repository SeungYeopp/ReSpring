// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";
// import type { NavigationItemProps } from "./types";
// import { Sprout, MessageCircle, Bell, HelpCircle, Pencil, MessageSquare, Target, User } from "lucide-react";

// const IconMap = {
//   Sprout,
//   MessageCircle,
//   Bell,
//   HelpCircle,
//   Pencil,
//   MessageSquare,
//   Target,
//   User,
// };

// export function NavigationItem({
//   label,
//   href,
//   iconName,
//   showLabel = true,
//   className,
//   isLogo = false,
//   isBottomNav = false, // 바텀네비 여부
//   isTopNav = false, // 🆕 추가: 상단 네비 여부
// }: NavigationItemProps) {
//   const pathname = usePathname();
//   const isActive = pathname === href;
//   const Icon = IconMap[iconName as keyof typeof IconMap];

//   if (!Icon) {
//     console.warn(`Icon "${iconName}" not found`);
//     return null;
//   }

//   return (
//     <Link
//       href={href}
//       className={cn(
//         "flex items-center transition-colors",
//         isBottomNav
//           ? "flex-col justify-center gap-1 px-2 py-1" // 바텀 네비 스타일
//           : isTopNav
//           ? "gap-2 px-3 py-2" // 🆕 상단 네비 스타일
//           : "gap-3 p-3", // 기본(사이드바) 스타일

//         //   바텀 네비 활성 스타일 유지 (변경 없음)
//         isActive && isBottomNav && "bg-gray-50/80 border-b-2 border-brand",

//         //   🚀 사이드바에서만 활성 스타일 적용
//         isActive && !isBottomNav && !isTopNav && "bg-gray-100 border-l-4 border-brand-dark",

//         isLogo ? "text-brand-dark font-bold text-lg" : "text-brand",
//         isBottomNav && "relative w-16 h-14",
//         className
//       )}
//     >
//       <Icon
//         className={cn(
//           "h-5 w-5",
//           isLogo && "h-6 w-6 text-brand-dark",
//           //   아이콘 색상 활성화 조건 변경 → 상단바는 활성화 스타일 없음
//           isActive && !isLogo && !isBottomNav && !isTopNav && "text-brand-dark"
//         )}
//       />
//       {showLabel && (
//         <span
//           className={cn(
//             isBottomNav ? "text-[10px]" : "text-sm",
//             isLogo && "text-base font-bold",
//             //   텍스트 색상 활성화 조건 변경 → 상단바는 활성화 스타일 없음
//             isActive && !isLogo && !isBottomNav && !isTopNav && "text-brand-dark font-medium"
//           )}
//         >
//           {label}
//         </span>
//       )}
//     </Link>
//   );
// }
