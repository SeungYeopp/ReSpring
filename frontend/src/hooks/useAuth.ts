"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSessionInfo } from "@/lib/api";

export function useAuth(blockUnauthenticated = true) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getSessionInfo();
        setIsAuthenticated(!!session?.userId);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if(!blockUnauthenticated)
        setIsAuthenticated(true); // 로그인에서 쳐내지 않는 경우에는 무조건 인증된 걸로 확인..

    if (isAuthenticated === false && blockUnauthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, blockUnauthenticated, router]);

  return { isAuthenticated, setIsAuthenticated };  // setIsAuthenticated를 반환하여 외부에서 상태를 변경할 수 있도록 함.
}
