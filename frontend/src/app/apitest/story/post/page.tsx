"use client"

import { useState } from "react";
import { makeStory } from "@/lib/api";  // api.ts 파일에 makeStory 함수가 있다고 가정

export default function StoryCreatePage() {
  const [userId, setUserId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [eventId, setEventId] = useState<number>(0);
  const [images, setImages] = useState<File[]>([]);
  const [message, setMessage] = useState<string>("");
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(Array.from(event.target.files));
    }
  };

  const handleSubmit = async () => {
    try {
      const storyId = await makeStory(userId, title, content, eventId, images);
      setMessage(`스토리가 성공적으로 생성되었습니다. ID: ${storyId}`);
    } catch (error) {
      setMessage("스토리 생성에 실패했습니다.");
    }
  };

  return (
    <div>
      <h1>스토리 생성</h1>
      
      <div>
        <label>User ID:</label>
        <input 
          type="text" 
          value={userId} 
          onChange={(e) => setUserId(e.target.value)} 
          placeholder="User ID" 
        />
      </div>

      <div>
        <label>Title:</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Title" 
        />
      </div>

      <div>
        <label>Content:</label>
        <textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          placeholder="Content" 
        />
      </div>

      <div>
        <label>Event ID:</label>
        <input 
          type="number" 
          value={eventId} 
          onChange={(e) => setEventId(Number(e.target.value))} 
          placeholder="Event ID" 
        />
      </div>

      <div>
        <label>이미지 업로드:</label>
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleImageChange} 
        />
      </div>

      <button onClick={handleSubmit}>스토리 생성</button>

      {message && <p>{message}</p>}
    </div>
  );
}
