// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import type { NavigationItemProps } from "./types"
// import { Sprout, MessageCircle, Bell, HelpCircle, Pencil, MessageSquare, Target, User } from "lucide-react"

// const IconMap = {
//   Sprout,
//   MessageCircle,
//   Bell,
//   HelpCircle,
//   Pencil,
//   MessageSquare,
//   Target,
//   User,
// }

// export function NavigationItem({
//   label,
//   href,
//   iconName,
//   showLabel = true,
//   className,
//   isLogo = false,
//   isBottomNav = false,
//   isTopNav = false,
// }: NavigationItemProps) {
//   const pathname = usePathname()
//   const isActive = pathname === href
//   const Icon = IconMap[iconName as keyof typeof IconMap]

//   if (!Icon) {
//     console.warn(`Icon "${iconName}" not found`)
//     return null
//   }

//   return (
//     <Link
//       href={href}
//       className={cn(
//         "flex items-center transition-colors",
//         isBottomNav ? "flex-col justify-center gap-1 px-2 py-1" : isTopNav ? "gap-2 px-3 py-2" : "gap-3 p-3",
//         isActive && isBottomNav && "bg-gray-50/80 border-b-2 border-brand",
//         isActive && !isBottomNav && !isTopNav && "bg-gray-100 border-l-4 border-brand-dark",
//         isLogo ? "text-brand-dark font-bold text-lg" : "text-brand",
//         isBottomNav && "relative w-16 h-14",
//         // 비활성 상태일 때 회색으로 변경
//         !isActive && !isLogo && "text-gray-500", // 추가된 부분
//         className,
//       )}
//     >
//       <Icon
//         className={cn(
//           "h-5 w-5",
//           isLogo && "h-6 w-6 text-brand-dark",
//           isActive && !isLogo && !isBottomNav && !isTopNav && "text-brand-dark",
//           // 비활성 상태일 때 회색으로 변경
//           !isActive && !isLogo && "text-gray-500", // 추가된 부분
//         )}
//       />
//       {showLabel && (
//         <span
//           className={cn(
//             isBottomNav ? "text-[10px]" : "text-sm",
//             isLogo && "text-base font-bold",
//             isActive && !isLogo && !isBottomNav && !isTopNav && "text-brand-dark font-medium",
//             // 비활성 상태일 때 회색으로 변경
//             !isActive && !isLogo && "text-gray-500", // 추가된 부분
//           )}
//         >
//           {label}
//         </span>
//       )}
//     </Link>
//   )
// }
