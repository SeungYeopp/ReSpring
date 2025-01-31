"use client"

import { useState } from "react"

import {makeBook} from "@/lib/api"

export default function BookPostTestPage() {
    const [userId, setUserId] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [tag, setTag]  = useState<string>("");
    const [storyIdsString, setStoryIdsString] = useState<string>("");
    const [storyIds, setStoryIds] = useState<number[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const [bookId, setBookId] = useState<string>("");

    const handleStoryIdsInput = (event : React.ChangeEvent<HTMLInputElement>) => {
        setStoryIdsString(event.target.value);

        const parsedStoryIds = storyIdsString
        .split(/[\s,]+/)
        .map(token => parseInt(token, 10))
        .filter(num => !isNaN(num))

        setStoryIds(parsedStoryIds);
    }

    const handleImageFileChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if(files)
            setImages(Array.from(files));
    }

    const handlePost = async () => {
        try{
            const result = await makeBook(userId, title, content, tag, storyIds, images);
            
            setBookId(result);
        }catch(error){
            console.error("에러 발생!!", error);
        }
    }

    return (
        <div>
            <h1>자서전 POST 테스트 페이지</h1>
            <label>유저 ID : </label>
            <input onChange={(event) => (setUserId(event.target.value))}></input>
            <label>제목 : </label>
            <input onChange={(event) => (setTitle(event.target.value))}></input>
            <label>내용 : </label>
            <input type="textarea" onChange={(event) => (setContent(event.target.value))}></input>
            <label>태그 : </label>
            <input onChange={(event) => (setTag(event.target.value))}></input>
            <label>조각 ID 여러 개 입력 (입력 예시 : "1, 2, 3, 4") : </label>
            <input onChange={handleStoryIdsInput}></input>
            <label>사진 입력 : </label>
            <input type="file" accept="image/*" onChange={handleImageFileChange}></input>

            <button onClick={handlePost}>POST</button>
            {bookId && <h1>봄날의 서 ID : {bookId}</h1>}
        </div>
    )
}