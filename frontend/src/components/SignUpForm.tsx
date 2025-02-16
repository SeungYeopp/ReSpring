"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signup } from "@/lib/api"
import { User, Mail, Lock, ImageIcon, ArrowRight, CheckCircle } from 'lucide-react'
import {useRouter} from 'next/navigation'

export function SignUpForm({ onPrevious }: { onPrevious: () => void }) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const router = useRouter();

  useEffect(() => {
    validateForm()
  }, [username, email, password, confirmPassword])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setImage(file)

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const validateForm = () => {
    const errors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    }

    if (username.length < 2) {
      errors.username = "사용자 이름은 2자 이상이어야 합니다."
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      errors.email = "올바른 이메일 형식이 아닙니다."
    }

    if (password.length < 8) {
      errors.password = "비밀번호는 8자 이상이어야 합니다."
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "비밀번호가 일치하지 않습니다."
    }

    setFieldErrors(errors)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!username || !email || !password || !confirmPassword || !image) {
      setError("모든 항목을 입력해주세요.")
      return
    }

    if (Object.values(fieldErrors).some(error => error !== "")) {
      setError("입력 정보를 다시 확인해주세요.")
      return
    }

    try {
      const signUpResult = await signup(username, email, password, "", image)
      if (!signUpResult) {
        setError("회원가입에 실패했습니다. 다시 시도해주세요.")
      } else {
        alert("회원가입이 완료되었습니다!")
        // window.location.href = "/main" // Redirect to main page
        router.replace('/auth');
      }
    } catch (error) {
      setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.")
      console.error(error)
    }
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-[#000000] text-center">
          봄날의 화원에 오신 것을 환영합니다!
        </h2>
        <p className="text-sm md:text-base text-[#7b7878] text-center mt-2">
          당신만의 계정을 만들어 봄날의 여정을 시작하세요.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm text-center"
          >
            {error}
          </motion.p>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Label htmlFor="username" className="text-[#000000]">사용자 이름</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7b7878]" size={18} />
            <Input
              id="username"
              type="text"
              placeholder="홍길동"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={`pl-10 border-[#dfeaa5] focus:ring-[#96b23c] ${fieldErrors.username ? 'border-red-500' : ''}`}
            />
          </div>
          {fieldErrors.username && <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Label htmlFor="email" className="text-[#000000]">이메일</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7b7878]" size={18} />
            <Input
              id="email"
              type="email"
              placeholder="example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`pl-10 border-[#dfeaa5] focus:ring-[#96b23c] ${fieldErrors.email ? 'border-red-500' : ''}`}
            />
          </div>
          {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Label htmlFor="password" className="text-[#000000]">비밀번호</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7b7878]" size={18} />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`pl-10 border-[#dfeaa5] focus:ring-[#96b23c] ${fieldErrors.password ? 'border-red-500' : ''}`}
            />
          </div>
          {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Label htmlFor="confirmPassword" className="text-[#000000]">비밀번호 확인</Label>
          <div className="relative">
            <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7b7878]" size={18} />
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`pl-10 border-[#dfeaa5] focus:ring-[#96b23c] ${fieldErrors.confirmPassword ? 'border-red-500' : ''}`}
            />
          </div>
          {fieldErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Label htmlFor="image" className="text-[#000000]">프로필 이미지</Label>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7b7878]" size={18} />
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="pl-10 border-[#dfeaa5] focus:ring-[#96b23c]"
            />
          </div>
          {preview && (
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              src={preview}
              alt="미리보기"
              className="w-24 h-24 object-cover rounded-full mx-auto mt-4"
            />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 md:flex md:flex-row-reverse md:space-y-0 md:space-x-4 md:space-x-reverse"
        >
          <Button type="submit" className="w-full md:w-1/2 bg-[#96b23c] text-[#ffffff] hover:bg-[#638d3e] flex items-center justify-center">
            가입하기 <ArrowRight className="ml-2" size={18} />
          </Button>
          <Button
            type="button"
            onClick={onPrevious}
            variant="outline"
            className="w-full md:w-1/2 text-[#638d3e] hover:text-[#96b23c] border-[#dfeaa5]"
          >
            이전 단계로
          </Button>
        </motion.div>
      </form>
    </div>
  )
}