"use client"

import {useState} from 'react'

import { getStoryById, Story } from '@/lib/api';

export default function StoryGetTestPage() {
    const [storyId, setStoryId] = useState<number>(0);
    const [story, setstory] = useState<Story>();

    const handleInput = (event : React.ChangeEvent<HTMLInputElement>) => {
        const storyIdGet = parseInt(event.target.value, 10);
        setStoryId(storyIdGet);
    }

    const handleGet = async () => {
        try{
            const result = await getStoryById(storyId);

            setstory(result);
        }catch(error){
            console.error('에러 발생..');
        }
    }

    return (
        <div>
            <label>STORY ID 입력 : </label>
            <input value={storyId} onChange={(event) => {setStoryId(parseInt(event.target.value, 10))}}></input>
            <button onClick={handleGet}>GET 요청</button>

            {story && <div>
                <h3>{story.title}</h3>
                <p>{story.content}</p>
                <p>생성일: {story.createdAt.toLocaleString()}</p>
                <p>수정일: {story.updatedAt.toLocaleString()}</p>
                <p>이벤트 ID : {story.eventId}</p>

                {story.images.length > 0 && (
                    <div>
                        <h4>이미지 목록</h4>
                        {story.images.map((img) => (
                            <img key={img.imageId} src={img.imageUrl} alt="스토리 이미지" width="100" />
                        ))}
                    </div>
                )}
                </div>
            }

        </div>
    )
}