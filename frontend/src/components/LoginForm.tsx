"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { login } from "@/lib/api";
import {GoogleLoginButton} from "@/components/google-login-button"
import {KakaoLoginButton} from "@/components/kakao-login-button"

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(email, password);

      if (!result) {
        alert("로그인 실패");
      }
    } catch (error) {
      alert("로그인 실패");
      console.error(error);
    } finally {
      window.location.reload();
    }
  };

  const handleTempLogin = async () => {
    try {
      const result = await login("parkssafy@gmail.com", "password");

      if (!result) {
        alert("로그인 실패");
      }
    } catch (error) {
      alert("로그인 실패");
      console.error(error);
    } finally {
      window.location.reload();
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>로그인</CardTitle>
        <CardDescription>계정에 로그인하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-brand-light focus:ring-brand-dark"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-brand-light focus:ring-brand-dark"
            />
          </div>
          <Button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white">
            로그인
          </Button>
        </form>

        {/* ✅ form 바깥에서 렌더링 ✅ */}
        <KakaoLoginButton redirectUrl="https://i12a307.p.ssafy.io:8080/oauth2/authorization/kakao" />
        <GoogleLoginButton />
        <Button type="button" onClick={handleTempLogin} className="w-full bg-brand hover:bg-brand-dark text-white">
          임시 로그인(개발용, 박싸피)
        </Button>
      </CardContent>
    </Card>
  );
}
