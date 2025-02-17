"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "@/lib/api"
import { GoogleLoginButton } from "@/components/google-login-button"
import { KakaoLoginButton } from "@/components/kakao-login-button"
import { Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      if (result) {
        alert("안녕하세요!");
        window.location.href = "/main";
      } else {
        alert("로그인 실패");
        window.location.reload();
      }
    } catch (error) {
      alert("로그인 실패");
      console.error(error);
      window.location.reload();
    }
  };


  return (
    <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-[#638d3e]">로그인</CardTitle>
        <CardDescription className="text-center text-[#4a6d2e]">계정에 로그인하여 서비스를 이용하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#4a6d2e]">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-[#96b23c] focus:ring-[#638d3e] transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#4a6d2e]">
              비밀번호
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-[#96b23c] focus:ring-[#638d3e] pr-10 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-[#638d3e]" />
                ) : (
                  <Eye className="h-4 w-4 text-[#638d3e]" />
                )}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#638d3e] hover:bg-[#4a6d2e] text-white transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
        <div className="mt-4 space-y-2">
          <KakaoLoginButton redirectUrl="https://i12a307.p.ssafy.io/api/oauth2/authorization/kakao" />
          <GoogleLoginButton redirectUrl="https://i12a307.p.ssafy.io/api/oauth2/authorization/google"/>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-[#4a6d2e]">
          처음이신가요?{" "}
          <Link
            href="/test/onboarding"
            className="text-[#638d3e] hover:text-[#4a6d2e] font-semibold transition-colors duration-200"
          >
            회원가입하기
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

