"use client"

import { useState } from "react"
import { signup } from "@/lib/api"

export default function SignUpTestPage() {
    const [nickname, setNickname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [msg, setMsg] = useState<string>("");

    const handlePost = async () => {
        try{
            const result = await signup(nickname, email, password);

            if(result === true){
                setMsg("회원 가입 완료!");
            }else{
                setMsg("회원 가입 실패..");
            }
        }catch(error){
            setMsg("회원 가입 실패..");
            console.error(error);
        }
    }

    return (
        <div>
            <h1>회원가입 테스트 페이지</h1>
            <label>닉네임 : </label>
            <input value={nickname} onChange={(e) => (setNickname(e.target.value))}></input>
            <label>이메일 : </label>
            <input value={email} onChange={(e) => (setEmail(e.target.value))}></input>
            <label>비밀번호 : </label>
            <input value={password} onChange={(e) => (setPassword(e.target.value))}></input>
            <button onClick={handlePost}>POST</button>
            <h3>{msg}</h3>
        </div>
    )
}