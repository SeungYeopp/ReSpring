"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signup } from "@/lib/api"

export function SignUpForm() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setImage(file)

    // 이미지 미리보기 생성
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!username || !email || !password || !image) {
      setError("모든 항목을 입력해주세요.")
      return
    }

    try {
      const signUpResult = await signup(username, email, password, "", image)
      if (!signUpResult) {
        alert("회원가입 실패")
      }
    } catch (error) {
      alert("회원가입 실패")
      console.error(error)
    } finally {
      window.location.reload()
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
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
          <div className="space-y-2">
            <Label htmlFor="image" className="text-black">프로필 이미지</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="border-brand-light focus:ring-brand-dark"
            />
            {preview && <img src={preview} alt="미리보기" className="w-24 h-24 object-cover rounded-full mx-auto mt-2" />}
          </div>
          <Button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white">
            가입하기
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
