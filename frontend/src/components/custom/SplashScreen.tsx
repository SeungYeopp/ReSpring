"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

const SplashScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      router.push("/")
    }, 4000)
    return () => clearTimeout(timer)
  }, [router])

  const flowerVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.5,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-b from-[#e8f3d6] to-[#96b23c] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background Pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <pattern id="flowerPattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <path
                d="M25,0 Q30,25 25,50 Q20,25 25,0 M0,25 Q25,30 50,25 Q25,20 0,25"
                fill="none"
                stroke="#638d3e"
                strokeWidth="1"
              />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#flowerPattern)" />
          </svg>

          {/* Main Text */}
          <motion.div
            className="text-center z-20 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.h1
              className="text-7xl font-bold text-[#638d3e] mb-2 font-serif"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              다시, 봄
            </motion.h1>
            <motion.h2
              className="text-5xl font-semibold text-[#4a6d2e] mb-6 font-serif"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.3 }}
            >
              RE:Spring
            </motion.h2>
            <motion.p
              className="text-2xl text-[#4a6d2e] font-handwriting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.6 }}
            >
              당신의 이야기가 꽃피는 계절
            </motion.p>
          </motion.div>

          {/* Flower Progress Indicator */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-6 h-6 bg-[#638d3e] rounded-full"
                  custom={i}
                  variants={flowerVariants}
                  initial="hidden"
                  animate="visible"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SplashScreen

