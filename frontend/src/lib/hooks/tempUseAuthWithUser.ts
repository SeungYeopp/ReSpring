import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
}

export function useAuthWithUser() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("fakeToken");
    if (token) {
      setIsLoggedIn(true);
      setUser({ id: "user123", name: "김민철" }); // 임시 사용자 정보
    }
  }, []);

  const login = () => {
    localStorage.setItem("fakeToken", "loggedIn");
    setIsLoggedIn(true);
    setUser({ id: "user123", name: "김민철" }); // 로그인 시 임시 유저 정보 설정
  };

  const logout = () => {
    localStorage.removeItem("fakeToken");
    setIsLoggedIn(false);
    setUser(null);
  };

  return { isLoggedIn, user, login, logout };
}
