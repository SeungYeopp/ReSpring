"use client"

import { LoginForm } from "@/components/LoginForm"
import Image from "next/image"
import Logo from"@/components/custom/onboarding/Logo"

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3d6] to-[#96b23c] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
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
      </div>

      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-8">
          <Logo></Logo>
          <h1 className="text-4xl font-bold text-[#638d3e] mt-4 font-serif">다시, 봄</h1>
          <h2 className="text-2xl font-semibold text-[#4a6d2e] mt-2 font-serif">RE:Spring</h2>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

