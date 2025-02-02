// 이벤트 관련 API를 호출하는 함수의 모음.
import { StringToBoolean } from "class-variance-authority/types";
import axiosAPI from "./axios";

// 봄날의 서 생성, 수정과 관련된 인터페이스.
export interface BookPostDto{
    userId : string,
    title : string,
    content : string,
    tag : string[],
    storyIds : number[],
}

// 봄날의 서에 관한 인터페이스.
export interface Book{
    id : string,
    userId : string,
    title : string,
    content : string,
    coverImg : string,
    tag : string[],
    likes : number,
    view : number,
    createdAt : Date,
    updatedAt : Date,
    storyIds : number[],
    imageUrls : string[]
}

// 봄날의 서 생성 함수
// 입력 : 유저 Id, 제목, 내용, 태그들, 커버 이미지
// 출력 : 봄날의 서 ID
export const makeBook = async (
    userId : string,
    title : string,
    content : string,
    tag: string[],
    storyIds : number[],
    coverImg : File
) : Promise<string> => {
    try{
        const formData = new FormData();
        formData.append('requestDto', new Blob([
            JSON.stringify({userId, title, content, tag, storyIds})
        ], {type : 'application/json'}
        ));
        
        formData.append('표지 이미지', coverImg);
        const response = await axiosAPI.post('/books', formData, {headers : {'Content-Type': 'multipart/form-data'}});

        return response.data;
    }catch(error : any){
        console.error('makeBook 에러 발생!', error);
        throw new Error(error.response?.data?.message ||'makeBook 에러 발생!');
    }
}

// 봄날의 서를 봄날의 서 ID로 검색
// 입력 : 봄날의 서 ID
// 출력 : 봄날의 서
export const getBookById = async (bookId : string) : Promise<Book>=> {
    try{
        const response = await axiosAPI.get(`/books/${bookId}`);

        // Date 형 변환.
        const bookdata : Book= {
            ...response.data,
            createdAt : new Date(response.data.createdAt),
            updatedAt : new Date(response.data.updatedAt)
        }

        console.log(bookdata)

        return bookdata;
    }catch(error : any){
        console.error('getBookById 에러', error);
        throw new Error(error.response?.data?.message ||'getBookById 에러');
    }
}

// 봄날의 서 내용 업데이트
// 입력 : 봄날의 서 ID, 유저 Id, 제목, 내용, 태그들, 봄날의 서 내 스토리 Id들, 봄날의 서 커버 이미지
// 출력 : 봄날의 서가 성공적으로 업데이트 되었을 시 true, 그외 false
export const updateBook = async (
    bookId : string, 
    userId : string, 
    title : string, 
    content : string, 
    tag : string[], 
    storyIds : number[], 
    image : File) : Promise<boolean> => {
        try{
            const formData = new FormData();
            formData.append('requestDto', new Blob([
                JSON.stringify({title, content, tag, storyIds})
            ], {type : 'application/json'}
            ));

            formData.append('표지 이미지', image);

            const response = await axiosAPI.put(`/books/${bookId}`, formData, {headers : {'Content-Type': 'multipart/form-data', 'X-User-Id': `${userId}`}});

            if(response.status === 200 || response.status === 204){
                return true;
            }else{
                console.error(`updateBook 에러 발생 봄날의 서 Id : ${bookId}, 유저 Id : ${userId}`);
                return false;
            }
        }catch(error : any){
            throw new Error(error.response?.data?.message ||`updateBook 에러 발생 봄날의 서 Id : ${bookId}, 유저 Id : ${userId}`);
        }
}

// 봄날의 서 삭제
// 입력 : 봄날의 서 ID, 유저 ID
// 출력 : 삭제 성공 시 true, 그외 false
export const deleteBook = async (bookId : string, userId : string) : Promise<boolean>=> {
    try{
        const response = await axiosAPI.delete(`/books/${bookId}`, {headers : {'X-User-Id' : `${userId}`}})

        if(response.status === 200 || response.status === 204){
            return true;
        }else{
            console.error(`deleteBook 에러 발생, 코드 : ${response.status}, bookId : ${bookId}`);
            return false;
        }
    }catch(error : any){
        throw new Error(error.response?.data?.message || `deleteBook 에러 발생, bookId : ${bookId}`)
    }
}

// 봄날의 서 좋아요 또는 좋아요 해제
// 입력 : 봄날의 서 ID, 유저 ID
// 출력 : 좋아요는 Liked, 좋아요 해제는 Unliked 반환.
export const likeOrUnlikeBook = async(bookId : string, userId : string) : Promise<string> => {
    try{
        const response = await axiosAPI.patch(`/books/likes/${bookId}?userId=${userId}`)

        return response.data; // Liked 또는 Unliked가 string 형식으로 반환됨.
    }catch(error : any){
        throw new Error(error.response?.data?.message ||`likeOrUnlikeBook 에러 발생, bookID : ${bookId}`);
    }
}

// 봄날의 서 최근 일주일 간 top 3 반환.
// 입력 : X
// 출력 : 봄날의 서 배열
export const getTopThreeWeeklyBooks = async() : Promise<Book[]> => {
    try{
        const response = await axiosAPI.get('/books/weeklyTop3');
        return response.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'getTopThreeWeeklyBooks 함수 API 호출에서 오류가 발생했습니다.');
    }
}

// 특정 유저에 대한 봄날의 서 전체
// 입력 : 유저 ID
// 출력 : 봄날의 서 배열
export const getAllBooksByUserId = async(userId : string) : Promise<Book[]> => {
    try{
        const response = await axiosAPI.get(`/books/user/${userId}`);

        return response.data;
    }catch(error : any){
        throw new Error(error.response?.data?.message || 'getAllBooksByUserId 함수 API 호출에서 오류가 발생했습니다.');
    }
}

// 내 봄날의 서 전체
// 입력 : 유저 Id(본인 ID)
// 출력 : 봄날의 서 배열열
export const getMyBooks = async(userId : string) : Promise<Book[]> => {
    try{
        const response = await axiosAPI.get('/books/my', {headers : {'X-User-Id': `${userId}`}});

        return response.data;
    }catch(error : any){
        throw new Error(error.response?.data?.message || 'getMyBooks 함수 API 호출에서 오류가 발생했습니다.');
    }
}

// 데이터베이스 상 모든 봄날의 서
// 입력 : X
// 출력 : 봄날의 서 배열
export const getAllBooks = async () : Promise<Book[]> => {
    try{
        const response = await axiosAPI.get('/books/all');

        return response.data;
    }catch(error : any){
        throw new Error(error.response?.data?.message || 'getAllBooks 함수 API 호출에서 오류가 발생했습니다.');
    }
}

// 정렬 기준으로 정렬된 모든 봄날의 서
// 입력 : sortFields -> 봄날의 서 내 필드 종류(ex. title, likes, view) string 배열, directions -> 오름차순('asc') 또는 내림차순('desc') string 배열
// 추가 설명 ) sortFields를 각각 ['title', 'likes']로 하고 directions를 ['desc', 'asc']로 한다면 제목으로 먼저 내림차순, 그다음 좋아요 수로 오름차순하는 것.
// 출력 : 봄날의 서 배열
export const getAllBooksSorted = async (sortFields:string[], directions:string[]) : Promise<Book[]> => {
    try{
        let url = '/books/all/sorted?';
        
        for(let i = 0;i<sortFields.length;i++){
            url += `sortFields=${sortFields[i]}&`
        }

        for(let i = 0;i<directions.length;i++){
            url += `directions=${directions[i]}`

            if(i !== directions.length-1)
                url += '&';
        }

        const response = await axiosAPI.get(url);

        return response.data;
    }catch(error : any){
        throw new Error(error.response?.data?.message || 'getAllBooksSorted 함수 API 호출에서 오류가 발생했습니다.');
    }
}