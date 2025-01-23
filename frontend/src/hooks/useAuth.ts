import { useState, useCallback } from "react"
import { login, register } from "@/lib/api"

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await login(email, password)
      return result
    } catch (e) {
      setError(e instanceof Error ? e.message : "로그인 중 오류가 발생했습니다.")
      return { success: false }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleRegister = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await register(email, password)
      return result
    } catch (e) {
      setError(e instanceof Error ? e.message : "회원가입 중 오류가 발생했습니다.")
      return { success: false }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
  }
}

