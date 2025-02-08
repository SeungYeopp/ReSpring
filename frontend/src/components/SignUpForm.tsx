"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signup, login } from "@/lib/api"
import { useRouter } from "next/navigation"

export function SignUpForm() {
  // 상태 관리를 위한 useState 훅 사용
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const router = useRouter();

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try{
      const signUpResult = await signup(username, email, password);

      if(!signUpResult){
        alert('회원가입 실패')
      }
    }catch(error){
      alert("회원가입 실패");
      console.error(error);
    }finally{
      window.location.reload();
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-black">회원가입</CardTitle>
        <CardDescription className="text-black">새로운 계정을 만들어보세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-black">사용자 이름</Label>
            <Input
              id="username"
              type="text"
              placeholder="홍길동"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="border-brand-light focus:ring-brand-dark"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-black">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-brand-light focus:ring-brand-dark"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-black">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-brand-light focus:ring-brand-dark"
            />
          </div>
          <Button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white">
            가입하기
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
