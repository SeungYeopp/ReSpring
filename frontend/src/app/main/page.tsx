// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { motion } from "framer-motion";

// export default function Home() {
//   const images = ["/main1.png", "/main2.png", "/main3.png", "/main4.png"];
//   const [visibleCount, setVisibleCount] = useState(1);

//   useEffect(() => {
//     document.body.style.overflow = "hidden";

//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, []);

//   useEffect(() => {
//     if (visibleCount < images.length) {
//       const timeout = setTimeout(() => {
//         setVisibleCount((prev) => prev + 1);
//       }, 1000);

//       return () => clearTimeout(timeout);
//     }
//   }, [visibleCount]);

//   return (
//     <div className="relative flex flex-col md:flex-row md:-my-4 h-screen bg-gradient-to-r md:from-white md:to-gray-100">
//       <div className="absolute bottom-0 mb-24 -ml-12 md:hidden w-full h-[70%] overflow-hidden">
//         {images.slice(0, visibleCount).map((src, i) => (
//           <motion.div
//             key={src}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1 }}
//             className="absolute inset-0 w-full h-full"
//           >
//             <Image 
//               src={src} 
//               alt={`Main ${i + 1}`} 
//               layout="fill" 
//               objectFit="contain"
//               objectPosition="bottom" 
//               className="scale-x-[-1]" 
//             />
//           </motion.div>
//         ))}
//       </div>

//       <div className="relative z-10 md:w-1/2 w-full h-1/2 md:h-full flex flex-col items-end justify-center p-6 mr-4">
//         <div className="text-5xl md:text-6xl font-semibold text-center md:text-right">시작해볼까요?</div>
//         <div className="border-t border-gray-300 w-full my-12"></div>

//         <div className="flex flex-col items-end space-y-2 w-full text-2xl text-brand">
//           <a href="/yesterday/writenote" className="md:text-gray-400 hover:text-brand">글조각 작성 →</a>
//           <a href="#" className="md:text-gray-400 hover:text-brand">봄의 서 읽기 →</a>
//           <a href="#" className="md:text-gray-400 hover:text-brand">무언가 →</a>
//         </div>
//       </div>

//       <div className="hidden md:flex md:w-1/2 h-full justify-end items-end relative">
//         {images.slice(0, visibleCount).map((src, i) => (
//           <motion.div
//             key={src}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1 }}
//             className="absolute w-full h-full flex justify-end items-end"
//           >
//             <Image 
//               src={src} 
//               alt={`Main ${i + 1}`} 
//               width={450} 
//               height={400} 
//               className="object-contain max-h-[100%] scale-x-[-1] md:scale-x-100" 
//             />
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }

'use client';

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bean, Sprout, Flower2, Pencil, BookOpen, LogOut } from "lucide-react"
import { logout, getSessionInfo } from "@/lib/api/user"

const Home = () => {
  const router = useRouter()
  const [userNickname, setUserNickname] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserNickname = async () => {
      try {
        const session = await getSessionInfo()
        setUserNickname(session.userNickname)
      } catch (error) {
        console.error("Failed to fetch user nickname:", error)
      }
    }

    fetchUserNickname()
  }, [])

  const handleLogout = async () => {
    try {
      const success = await logout()
      if (success) {
        router.push("/a") // 바로 auth로 가면 사이드바가 안 사라져서 일부러 엉뚱한 곳 우선 접근
      } else {
        alert("로그아웃 실패! 다시 시도해주세요.")
      }
    } catch (error) {
      console.error(error)
      alert("로그아웃 중 오류 발생!")
    }
  }

  const tileLinks = [
    {
      id: 1,
      url: "/yesterday",
      title: "어제",
      content: "당신의 이야기를 나누어보세요.",
      bgColor: "bg-red-100",
      circleColor: "bg-red-400",
      icon: <Bean className="text-white w-8 h-8" />,
    },
    {
      id: 2,
      url: "/today",
      title: "오늘",
      content: "당신의 궁금증을 해결해보세요.",
      bgColor: "bg-green-100",
      circleColor: "bg-green-400",
      icon: <Sprout className="text-white w-8 h-8" />,
    },
    {
      id: 3,
      url: "/tomorrow",
      title: "내일",
      content: "당신의 목표를 세워보세요.",
      bgColor: "bg-blue-100",
      circleColor: "bg-blue-400",
      icon: <Flower2 className="text-white w-8 h-8" />,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="md:-pt-12 pb-8">
        <Sprout className="w-16 h-16 text-[#96b23c]" />
      </div>

      {/* Rounded Rectangular Links */}
      <div className="w-full max-w-md space-y-4 flex flex-col">
        {tileLinks.map((tile) => (
          <Link key={tile.id} href={tile.url} passHref>
            <div
              className={`${tile.bgColor} p-6 rounded-2xl shadow-md cursor-pointer hover:opacity-80 flex items-center max-h-32 overflow-hidden`}
            >
              <div className="w-1/3 -ml-8 -mr-2 flex justify-center items-center">
                <div className={`w-16 h-16 ${tile.circleColor} rounded-full flex justify-center items-center`}>
                  {tile.icon}
                </div>
              </div>
              <div className="flex flex-col w-2/3">
                <h2 className="text-xl font-semibold">{tile.title}</h2>
                <p className="text-gray-600">{tile.content}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Square Tile Links with Icons */}
      <div className="w-full max-w-md mt-8 grid grid-cols-3 gap-4">
        {/* 글조각 작성 */}
        <Link href="/yesterday/writenote" passHref className="block">
          <div className="bg-white rounded-2xl shadow-md cursor-pointer hover:bg-gray-200 w-full aspect-square flex flex-col items-start justify-between p-4 relative">
            <div className="absolute top-2 right-2">
              <Pencil className="text-gray-700 w-6 h-6" />
            </div>
            <div className="mt-auto">
              <h2 className="text-md font-semibold">글조각 작성</h2>
              <p className="text-xs text-gray-600 mt-1">글조각을 작성해보세요.</p>
            </div>
          </div>
        </Link>

        {/* 서재 보기 */}
        {userNickname ? (
          <Link href={`/profile/booklist/${userNickname}`} passHref className="block">
            <div className="bg-white rounded-2xl shadow-md cursor-pointer hover:bg-gray-200 w-full aspect-square flex flex-col items-start justify-between p-4 relative">
              <div className="absolute top-2 right-2">
                <BookOpen className="text-gray-700 w-6 h-6" />
              </div>
              <div className="mt-auto">
                <h2 className="text-md font-semibold">서재 보기</h2>
                <p className="text-xs text-gray-600 mt-1">내가 쓴 글을 확인해보세요.</p>
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-gray-100 rounded-2xl shadow-md w-full aspect-square flex flex-col items-center justify-center p-4">
            <p className="text-sm text-gray-500">로딩 중...</p>
          </div>
        )}

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="bg-white rounded-2xl shadow-md cursor-pointer hover:bg-gray-200 w-full aspect-square flex flex-col items-start justify-between p-4 relative"
        >
          <div className="absolute top-2 right-2">
            <LogOut className="text-gray-700 w-6 h-6" />
          </div>
          <div className="mt-auto text-left">
            <h2 className="text-md font-semibold">로그아웃</h2>
            <p className="text-xs text-gray-600 mt-1">휴식도 필요한 법이지요.</p>
          </div>
        </button>
      </div>
    </div>
  )
}

export default Home
