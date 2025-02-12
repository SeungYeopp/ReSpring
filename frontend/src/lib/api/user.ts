// 유저 관련 API를 호출하는 함수 모음
import axiosAPI from "./axios";

export interface SessionInfo{
    nickname: string,
    userId: string
}

export interface UserInfo{
    userId: string,
    userNickname: string,
    profileImageUrl: string
}

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

        const response = await axiosAPI.post('/user/login', formData);

        if(response.status === 200 || response.status === 201 || response.status === 204)
            return true;
        else{
            return false;
        }
    }catch(error : any){
        throw new Error(error.response?.data?.message || "login 함수 에러 발생");
    }
}

// 사용자 ID와 닉네임이 저장된 세션 정보를 받아오는 함수.
// 이 함수를 사용하기 전에 먼저 위 login() 함수에서 response 성공 코드를 받아야 합니다.
// 이후 아래 함수를 사용해서 session 정보를 받을 수 있습니다.
// 입력 : X
// 출력 : SessionInfo 정보.
export const getSessionInfo = async () : Promise<SessionInfo> => {
    try{
        const response = await axiosAPI.get('/user/me');

        return response.data as SessionInfo;
    }catch(error : any){
        throw new Error(error.response?.data?.message || "getSessionInfos() 함수 호출 에러 발생!");
    }
}

// 사용자 닉네임으로 정보를 받아오는 함수.
// 입력 : 유저 닉네임(string)
// 출력 : UserInfo 정보.
export const getUserInfoByNickname = async (nickname: string) : Promise<UserInfo> => {
    try{
        const response = await axiosAPI.get(`/user/user/profile/${encodeURIComponent(nickname)}`);

        return response.data as UserInfo;
    }catch(error : any){
        throw new Error(error.response?.data?.message || "getUserInfoByNickname() 함수 호출 에러 발생!");
    }
}

// 사용자 로그아웃 함수
// 입력 : X
// 출력 : 로그아웃 성공 시 true, 그 외 false.
export const logout = async() : Promise<boolean> => {
    try{
        const response = await axiosAPI.post('/user/logout');

        if(response.status === 200 || response.status === 204)
            return true;
        else
            return false;
    }catch(error){
        throw new Error("logout() 함수 호출 에러 발생!");
    }
}