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
    tags : string[],
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
                    <h4>봄날의 서 태그들 : </h4>
                    {book.tags.map((tag) => (
                        <span key={tag}>
                            {tag}, 
                        </span>
                    ))}
                    <h4>받은 좋아요 수 : {book.likes}</h4>
                    <h4>조회수 : {book.view}</h4>
                    <h4>생성 날짜 : {book.createdAt.toLocaleString()}</h4>
                    <h4>수정 날짜 : {book.updatedAt.toLocaleString()}</h4>
                    <h4>봄날의 서에 담긴 이벤트 정보들 : </h4>
                    {book.storyIds.map((id, index) => (
                        <span key={id}>
                            {id},
                        </span>
                    ))}
                    <h4>봄날의 서 내에 있는 이벤트 사진들 : </h4>
                    {book.imageUrls && book.imageUrls.map((imgUrl) => (
                        <img key={imgUrl} src={imgUrl} width="100" alt={imgUrl}></img>
                    ))}
                </div>
            )}
        </div>
    )
}