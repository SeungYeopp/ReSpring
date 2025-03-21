"use client";

import { useState, useEffect } from "react";
import { getSessionInfo } from "@/lib/api";

export function useAuth(blockUnauthenticated : boolean) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userNickname, setUserNickname] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const checkAuth = async () => {
        if(blockUnauthenticated){ // 실제 로그인 인증 기능을 사용하는 경우.
            try {
                const session = await getSessionInfo();
                if(session && session.userNickname && session.userId){
                    setIsAuthenticated(true);
                    setUserNickname(session.userNickname);        
                    setUserId(session.userId);        
                }else{
                    setIsAuthenticated(false);
                    setUserNickname("");  
                    setUserId("");  
                }
              } catch (error) {
                setIsAuthenticated(false);
                setUserNickname("");
                setUserId("");
              }
        }else{  // 실제 로그인 인증 기능을 사용하지 않는 경우.
            setIsAuthenticated(true);
            setUserNickname("mock-user-nickname");
        }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, setIsAuthenticated, userNickname, userId };  // setIsAuthenticated를 반환하여 외부에서 상태를 변경할 수 있도록 함.
}
