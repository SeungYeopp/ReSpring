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

export const signup = async (userNickname : string, email : string, password : string, provider : string, image : File) : Promise<boolean>=> {
    try{
        const formData = new FormData;
        
        formData.append('signUpRequestDto', JSON.stringify({
            userNickname,
            email,
            password,
            provider
          }));
        formData.append('image', image);
        const response = await axiosAPI.post('/user/signup', formData, {headers : {'Content-Type': 'multipart/form-data'}});

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

        const response = await axiosAPI.post('/auth/login', formData);

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
export const getSessionInfo = async () : Promise<UserInfo> => {
    try{
        const response = await axiosAPI.get('/user/me');

        return response.data as UserInfo;
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
        const response = await axiosAPI.post('/auth/logout');

        if(response.status === 200 || response.status === 204)
            return true;
        else
            return false;
    }catch(error){
        throw new Error("logout() 함수 호출 에러 발생!");
    }
}


// 회원 정보 조회 API 호출 함수
export const getUserInfo = async (): Promise<UserInfo> => {
    const response = await axiosAPI.get<UserInfo>('/user/me');
    return response.data;
  };


  /**
 * ✅ 사용법 예시
 *
 * 1. 비동기 함수 안에서 사용:
 *    const userInfo = await getUserInfo();
 *    console.log(userInfo.userNickname); // 닉네임 출력
 *
 * 2. React 컴포넌트에서 CSR(클라이언트 사이드 렌더링)로 쓰기:
 *    import { useEffect, useState } from 'react';
 *    import { getUserInfo } from '@/lib/api/user';
 *
 *    const ExampleComponent = () => {
 *      const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
 *
 *      useEffect(() => {
 *        const fetchUserInfo = async () => {
 *          try {
 *            const data = await getUserInfo();
 *            setUserInfo(data);
 *          } catch (error) {
 *            console.error('유저 정보 불러오기 실패:', error);
 *          }
 *        };
 *
 *        fetchUserInfo();
 *      }, []);
 *
 *      return <div>닉네임: {userInfo ? userInfo.userNickname : '로딩 중...'}</div>;
 *    };
 *
 * 3. SSR(Server Side Rendering)에서 가져와서 props로 넘길 때:
 *    import { getUserInfo } from '@/lib/api/user';
 *
 *    const Page = async () => {
 *      const userInfo = await getUserInfo(); // 서버 사이드에서 실행
 *
 *      return <div>닉네임: {userInfo.userNickname}</div>;
 *    };
 *
 *    export default Page;
 *
 * ⚠️ 주의사항:
 * - 반드시 로그인된 상태여야 정상 동작함!
 * - 쿠키/세션 정보를 포함해서 요청하려면 axios 인스턴스(axiosAPI)를 써야 함 (withCredentials 설정되어 있음)
 */