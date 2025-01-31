// 이벤트 관련 API를 호출하는 함수의 모음.
import axiosAPI from "./axios";

export interface BookPostDto{
    userId : string,
    title : string,
    content : string,
    tag : string,
    storyIds : number[],
}

/*
{
  "id": "679c72b62649ae37363ce1b0",
  "userId": "307e9786-df87-11ef-925c-d4f32d1471a6",
  "title": "제목제목",
  "content": "제목제목",
  "coverImg": null,
  "tag": "제목제목",
  "likes": 0,
  "view": 0,
  "createdAt": "2025-01-31T15:50:30.792",
  "updatedAt": "2025-01-31T15:50:30.792",
  "storyIds": [],
  "imageUrls": []
}
 */

export interface Book{
    id : string,
    userId : string,
    title : string,
    content : string,
    coverImg : string,
    tag : string,
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
    tag: string,
    storyIds : number[],
    images : File[]
) : Promise<string> => {
    try{
        const formData = new FormData();
        formData.append('requestDto', new Blob([
            JSON.stringify({userId, title, content, tag, storyIds})
        ], {type : 'application/json'}
        ));
        
        images.forEach((image) => {
            formData.append('images', image);
        })
        

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