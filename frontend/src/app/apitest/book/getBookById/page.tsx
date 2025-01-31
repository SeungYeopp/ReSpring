"use client"

import { useState } from "react"
import { getBookById, Book } from "@/lib/api"



export default function GetBookById() {
    const [bookId, setBookId] = useState<string>("");
    const [book, setBook] = useState<Book>();

    const handleGet = async () => {
        try{
            const result : Book = await getBookById(bookId);

            setBook(result);
        }catch(error){
            console.error('GetBookById 에러', error);
        }
    }
/*
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

*/
    return (
        <div>
            <label>봄날의 서 ID 입력 : </label>
            <input value = {bookId} onChange={(event) => (setBookId(event.target.value))}></input>
            <button onClick={handleGet}>GET 요청하기</button>
            
            
            {book && (
                <div>
                    <h4>봄날의 서 제목 : {book.title}</h4>
                    <h4>봄날의 서 내용 : {book.content}</h4>
                    <h4>봄날의 서 유저 ID : {book.userId}</h4>
                    {book.coverImg && <img key={book.coverImg} src={book.coverImg} alt="봄날의 서 이미지" width="100" />}
                </div>
            )}
        </div>
    )
}