// 유저 관련 API를 호출하는 함수 모음
import { Truculenta } from "next/font/google";
import axiosAPI from "./axios";

// 사용자 회원가입 함수
// 입력 : 유저 닉네임(string), 이메일(string), 비밀번호(string)
// 출력 : 회원가입 성공 여부 (true/false)
export const signup = async (userNickname : string, email : string, password : string) : Promise<boolean>=> {
    try{
        const formData = new FormData;

        formData.append('userNickname', `${userNickname}`);
        formData.append('email', `${email}`)
        formData.append('password', `${password}`)

        const response = await axiosAPI.post('/user/signup', formData);

        if(response.status === 200 || response.status === 201 || response.status === 204)
            return true;
        else{
            console.error("signup 함수 에러 발생");
            return false;
        }
            
    }catch(error : any){
        throw new Error(error.response?.data?.message || "signup 함수 에러 발생");
    }
}

// 사용자 로그인 함수
// 입력 : email(string), password(string)
// 출력 : 로그인 성공 여부 (true/false)
export const login = async (email : string, password : string) : Promise<boolean>=> {
    try{
        const formData = new FormData();

        formData.append('email', email);
        formData.append('password', password);

        const response = await axiosAPI.post('/user/login', formData, {withCredentials : false});

        console.log(response);

        if(response.status === 200 || response.status === 201 || response.status === 204)
            return true;
        else{
            return false;
        }
    }catch(error : any){
        throw new Error(error.response?.data?.message || "login 함수 에러 발생");
    }
}