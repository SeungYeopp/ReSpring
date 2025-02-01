"use client"

import { useState } from "react"

import {makeBook} from "@/lib/api"

export default function BookPostTestPage() {
    const [userId, setUserId] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [tags, setTags]  = useState<string[]>([]);
    const [storyIdsString, setStoryIdsString] = useState<string>("");
    const [storyIds, setStoryIds] = useState<number[]>([]);
    const [image, setImage] = useState<File>();
    const [bookId, setBookId] = useState<string>("");
    const [msg, setMsg] = useState<string>("");

    const handleStoryIdsInput = (event : React.ChangeEvent<HTMLInputElement>) => {
        const parsedStoryIds = event.target.value
        .split(/[\s,]+/) // 공백 또는 쉼표 기준으로 분리
        .map(num => Number(num.trim())) // 숫자로 변환
        .filter(num => !isNaN(num)); // 숫자가 아닌 값 제거

        console.log(parsedStoryIds)

        setStoryIds(parsedStoryIds);
    }

    const handleTagsInput = (event : React.ChangeEvent<HTMLInputElement>) => {
        const tagsStr = event.target.value;

        const parsedTags = tagsStr
        .split(/[\s,]+/)

        setTags(parsedTags);
    }

    const handleImageFileChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if(files)
            setImage(files[0]);
    }

    const handlePost = async () => {
        try{
            if(image){
                const result = await makeBook(userId, title, content, tags, storyIds, image);
            
                setBookId(result);
            }else{
                setMsg("이미지를 넣으세요!");
            }

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
            <label>태그 여러 개 입력 (입력 예시 : "청춘, 졸업, 기타"): </label>
            <input onChange={handleTagsInput}></input>
            <label>조각 ID 여러 개 입력 (입력 예시 : "1, 2, 3, 4") : </label>
            <input onChange={handleStoryIdsInput}></input>
            <label>사진 입력 : </label>
            <input type="file" accept="image/*" onChange={handleImageFileChange}></input>

            <button onClick={handlePost}>POST</button>
            <h1>{msg}</h1>
            {bookId && <h1>봄날의 서 ID : {bookId}</h1>}
        </div>
    )
}