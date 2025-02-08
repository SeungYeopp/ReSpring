"use client";

import { useState } from "react";
import { SignUpForm } from "@/components/SignUpForm";
import { LoginForm } from "@/components/LoginForm";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-screen flex flex-col justify-center items-center bg-gray-100 overflow-hidden">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <Button
            onClick={() => setIsLogin(true)}
            variant={isLogin ? "default" : "outline"}
            className="mr-2"
          >
            로그인
          </Button>
          <Button
            onClick={() => setIsLogin(false)}
            variant={!isLogin ? "default" : "outline"}
          >
            회원가입
          </Button>
        </div>
        {isLogin ? <LoginForm /> : <SignUpForm />}
      </div>
    </div>
  );
}
