"use client"

import { useState } from "react"
import { logout } from "@/lib/api"

export default function LoginTestPage() {
    const [msg, setMsg] = useState<string>("");

    const handleLogout = async () => {
        try{
            const result = await logout();

            if(result === true){
                setMsg("로그아웃 완료!");
            }else{
                setMsg("로그아웃 실패..");
            }
        }catch(error){
            setMsg("로그아웃 실패..");
            console.error(error);
        }
    }

    return (
        <div>
            <h1>로그아웃 테스트 페이지</h1>
            <button onClick={handleLogout}>로그아웃</button>
            <h3>{msg}</h3>
        </div>
    )
}