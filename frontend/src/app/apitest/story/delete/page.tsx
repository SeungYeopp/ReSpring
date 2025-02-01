"use client"

import { useState } from "react"
import { deleteStory } from "@/lib/api";

export default function DeleteTest(){
    const [storyId, setStoryId] = useState<number>(0);
    const [text, setText] = useState<string>("");

    const handleStoryId = (event : React.ChangeEvent<HTMLInputElement>) => {
        const storyIdValue = parseInt(event.target.value, 10);
        setStoryId(storyIdValue);
    }

    const handleDeletion = async () => {
        try{
            const result : boolean = await deleteStory(storyId);

            if(result === true)
                setText(`${storyId} 를 제거하는 데 성공했습니다!`);
            else
            setText(`${storyId} 를 제거하는 데 실패했습니다`);
        }catch(error){
            console.error('에러 발생', error);
        }
    }

    return (
        <div>
            <label>삭제할 스토리 ID 입력</label>
            <input value={storyId} onChange={handleStoryId}></input>
            <button onClick={handleDeletion}>삭제하기</button>
            <h3>{text}</h3>
        </div>
    )
}