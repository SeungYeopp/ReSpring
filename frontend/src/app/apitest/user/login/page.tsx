"use client"

import { useState } from "react"
import { login } from "@/lib/api"

export default function LoginTestPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [msg, setMsg] = useState<string>("");

    const handlePost = async () => {
        try{
            const result = await login(email, password);

            if(result === true){
                setMsg("로그인 완료!");
            }else{
                setMsg("로그인 실패..");
            }
        }catch(error){
            setMsg("로그인 실패..");
            console.error(error);
        }
    }

    return (
        <div>
            <h1>로그인 테스트 페이지</h1>
            <label>이메일 : </label>
            <input value={email} onChange={(e) => (setEmail(e.target.value))}></input>
            <label>비밀번호 : </label>
            <input value={password} onChange={(e) => (setPassword(e.target.value))}></input>
            <button onClick={handlePost}>POST</button>
            <h3>{msg}</h3>
        </div>
    )
}