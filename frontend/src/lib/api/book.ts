// 이벤트 관련 API를 호출하는 함수의 모음.
import { StringToBoolean } from "class-variance-authority/types";
import axiosAPI from "./axios";

export interface BookPostDto{
    userId : string,
    title : string,
    content : string,
    tag : string[],
    storyIds : number[],
}

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

            if(response.status === 200){
                return true;
            }else{
                console.error(`updateBook 에러 발생 봄날의 서 Id : ${bookId}, 유저 Id : ${userId}`);
                return false;
            }
        }catch(error : any){
            throw new Error(error.response?.data?.message ||`updateBook 에러 발생 봄날의 서 Id : ${bookId}, 유저 Id : ${userId}`);
        }
}

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

export const likeOrUnlikeBook = async(bookId : string, userId : string) : Promise<string> => {
    try{
        const response = await axiosAPI.patch(`/books/likes/${bookId}?userId=${userId}`)

        return response.data; // Liked 또는 Unliked가 string 형식으로 반환됨.
    }catch(error : any){
        throw new Error(error.response?.data?.message ||`likeOrUnlikeBook 에러 발생, bookID : ${bookId}`);
    }
}

export const getTopThreeWeeklyBooks = async() : Promise<Book[]> => {
    try{
        const response = await axiosAPI.get('/books/weeklyTop3');
        return response.data;
    }catch(error: any){
        throw new Error(error.response?.data?.message || 'getTopThreeWeeklyBooks 함수 API 호출에서 오류가 발생했습니다.');
    }
}

export const getAllBooksByUserId = async(userId : string) : Promise<Book[]> => {
    try{
        const response = await axiosAPI.get(`/books/user/${userId}`);

        return response.data;
    }catch(error : any){
        throw new Error(error.response?.data?.message || 'getAllBooksByUserId 함수 API 호출에서 오류가 발생했습니다.');
    }
}

