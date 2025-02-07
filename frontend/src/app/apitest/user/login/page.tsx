"use client"

import { useState } from "react"
import { login, getSessionInfo } from "@/lib/api"

export default function LoginTestPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [userNickname, setUserNickname] = useState<string>("");
    const [msg, setMsg] = useState<string>("");

    const handlePost = async () => {
        try{
            const loginResult = await login(email, password);

            if(loginResult === true){
                setMsg("로그인 완료!");
                const sessionResult = await getSessionInfo();

                console.log(sessionResult)

                setUserId(sessionResult.userId);
                setUserNickname(sessionResult.nickname);
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
            <h1>로그인 / 세션 정보 불러오기 테스트 페이지</h1>
            <label>이메일 : </label>
            <input value={email} onChange={(e) => (setEmail(e.target.value))}></input>
            <label>비밀번호 : </label>
            <input value={password} onChange={(e) => (setPassword(e.target.value))}></input>
            <button onClick={handlePost}>POST</button>
            <h3>{msg}</h3>
            <h3>세션에 저장된 유저 ID : {userId} </h3>
            <h3>세션에 저장된 유저 닉네임 : {userNickname}</h3>
        </div>
    )
}