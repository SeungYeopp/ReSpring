"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookOpen, Sprout, Video } from "lucide-react"

export default function TestPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#f0f0f0] p-4 space-y-8 font-sans relative overflow-hidden">
      {/* 배경 잎사귀 효과 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-[#96b23c] opacity-20"
            initial={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              rotate: 0,
              scale: 0,
            }}
            animate={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              rotate: 360,
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Sprout size={30 + Math.random() * 20} />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#638d3e] text-center mb-2 leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          다시, 봄(Re:Spring)
        </motion.h1>
        <motion.p
          className="text-center text-[#7b7878] mb-8 text-lg md:text-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          당신의 새로운 이야기를 시작하세요
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="rounded-3xl shadow-lg p-8 bg-white border-2 border-[#dfeaa5]">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-[#638d3e] text-center">봄날의 체험관</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/test/onboarding" passHref>
                <Button className="w-full rounded-xl bg-[#96b23c] hover:bg-[#638d3e] text-white shadow-md transition-all transform hover:scale-105 h-auto py-4 md:py-6 text-base md:text-lg flex flex-col items-center group">
                  <BookOpen className="mb-2 h-6 w-6 md:h-8 md:w-8 group-hover:animate-bounce" />
                  <span className="font-semibold">온보딩 체험하기</span>
                  <span className="text-sm mt-1 opacity-80">새로운 시작을 위한 단계별 가이드를 경험해보세요</span>
                </Button>
              </Link>
              <Link href="/test/MediaChat" passHref>
                <Button className="w-full rounded-xl bg-[#96b23c] hover:bg-[#638d3e] text-white shadow-md transition-all transform hover:scale-105 h-auto py-4 md:py-6 text-base md:text-lg flex flex-col items-center group">
                  <Video className="mb-2 h-6 w-6 md:h-8 md:w-8 group-hover:animate-pulse" />
                  <span className="font-semibold">일대다 화상채팅 체험하기</span>
                  <span className="text-sm mt-1 opacity-80">다양한 사람들과 실시간으로 소통하는 경험을 해보세요</span>
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>

        <motion.div
          className="mt-8 text-center text-[#638d3e]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <p className="flex items-center justify-center text-sm md:text-base">
            <Sprout className="mr-2" size={20} />
            새로운 시작을 향한 첫 걸음을 내딛어보세요
          </p>
        </motion.div>
      </div>
    </div>
  )
}

