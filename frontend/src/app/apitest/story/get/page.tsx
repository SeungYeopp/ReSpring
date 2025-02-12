"use client"

import {useState} from 'react'

import { getAllStories, Story } from '@/lib/api';

export default function StoryGetTestPage() {
    const [userId, setUserId] = useState<string>("");
    const [stories, setStories] = useState<Story[]>([]);

    const handleGet = async () => {
        try{
            const result = await getAllStories(userId);

            setStories(result);
        }catch(error){
            console.error('에러 발생..');
        }
    }

    return (
        <div>
            <label>USER ID 입력 : </label>
            <input value={userId} onChange={(event) => {setUserId(event.target.value)}}></input>
            <button onClick={handleGet}>GET 요청</button>

            <ul>
                {
                    stories.map((story : Story) => (
                        <li key={story.id}>
                            <h3>{story.title}</h3>
                            <p>{story.content}</p>
                            <p>생성일: {story.createdAt.toLocaleString()}</p>
                            <p>수정일: {story.updatedAt.toLocaleString()}</p>
                            <p>이벤트 ID : {story.eventId}</p>

                            {story.images.length > 0 && (
                                <div>
                                    <h4>이미지 목록</h4>
                                    {story.images.map((img) => (
                                        <img key={img} src={img} alt="스토리 이미지" width="100" />
                                    ))}
                                </div>
                            )}
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}