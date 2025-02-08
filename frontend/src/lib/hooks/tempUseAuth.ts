//src/app/lib/hooks/tempUseAuth.ts
import { useState, useEffect } from "react";

export function useAuth() {
  // 로그인 상태를 저장할 State
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 앱 시작 시(localStorage에 토큰이 있으면 로그인된 상태로 간주)
  useEffect(() => {
    const token = localStorage.getItem("fakeToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // 임시로 로그인하는 함수
  const login = () => {
    // 실제 로그인 API가 완성되면 그때 이 로직을 교체
    localStorage.setItem("fakeToken", "김민철 바~보~");
    setIsLoggedIn(true);
  };

  // 임시로 로그아웃하는 함수
  const logout = () => {
    localStorage.removeItem("fakeToken");
    setIsLoggedIn(false);
  };

  // 실제 프로젝트에서는 user 정보(예: userId, username 등)도 여기에 넣을 수 있음
  return {
    isLoggedIn,
    login,
    logout,
  };
}
