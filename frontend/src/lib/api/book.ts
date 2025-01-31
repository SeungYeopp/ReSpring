// 이벤트 관련 API를 호출하는 함수의 모음.
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
    imagesUrls : string[]
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
        
        formData.append('coverImg', coverImg);
        
        const response = await axiosAPI.post('/books', formData, {headers : {'Content-Type': 'multipart/form-data'}});

        return response.data;
    }catch(error){
        console.error('makeBook 에러 발생!', error);
        throw new Error('makeBook 에러 발생!');
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

        return bookdata;
    }catch(error){
        console.error('getBookById 에러', error);
        throw new Error('getBookById 에러');
    }
}