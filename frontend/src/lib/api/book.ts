// 이벤트 관련 API를 호출하는 함수의 모음.
import axiosAPI from "./axios";

/*
{
  "userId": "307e9786-df87-11ef-925c-d4f32d1471a6",
  "title": "제목1",
  "content": "컨텐츠1",
  "tag": "태그1",
  "storyIds": [
    1
  ]
}
*/

export interface BookPostDto{
    userId : string,
    title : string,
    content : string,
    tag : string,
    storyIds : number[],
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