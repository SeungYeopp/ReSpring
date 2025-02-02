"use client";

import { useState, useEffect } from "react";
import { getAllStories, Story } from "@/lib/api";
import { Tags } from "lucide-react";

export default function CreateBook() {
  const [userId, setUserId] = useState<string>("");
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStories, setSelectedStories] = useState<Story[]>([]);
  const [step, setStep] = useState(1);

  const [msg, setMsg] = useState<string>("...");

  /*
  export interface BookPostDto{
    userId : string,
    title : string,
    content : string,
    tag : string[],
    storyIds : number[],
}
  */
  const [bookTitle, setBookTitle] = useState<string>("");
  const [bookContent, setBookContent] = useState<string>("");
  const [bookTags, setBookTags] = useState<string[]>([]);
  const [bookStoryIds, setBookStoryIds] = useState<number[]>([]);
  const [bookCoverImg, setBookCoverImg] = useState<File>();

  const handleStoriesGet = async () => {
    try{
      const result = await getAllStories(userId);

      setStories(result);
    }catch(error){
      setMsg('에러 발생' + error);
    }
  }

  const handleTags = (event : React.ChangeEvent<HTMLInputElement>) => {
    const tagParsed = event.target.value.split(',').map((tag) => tag.trim());
    
    setBookTags(tagParsed);
  }

  const handleImageUpload = (event : React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if(files){
      setBookCoverImg(files[0]);
    }
  }

  const handleSubmit = () => {
    alert("봄날의 서 제작 완료!");
  }

  return (
    <div className="flex flex-col items-center">
      <div>
        {step === 1 && 
          <div>
            글조각 선택하기
            <button className="bg-brand" onClick={() => setStep(step + 1)}>
              다음
            </button>
          </div>
        }

        {step === 2 && 
          <div>
            <button className="bg-brand" onClick={() => setStep(step - 1)}>
              이전
            </button>
            봄날의 서 쓰기
            <button className="bg-brand" onClick={() => setStep(step + 1)}>
              다음
            </button>
          </div>
        }

        {step === 3 && 
          <div>
            <button className="bg-brand" onClick={() => setStep(step - 1)}>
              이전
            </button>
            표지 선택
            <button className="bg-brand" onClick={() => setStep(step + 1)}>
              다음
            </button>
          </div>
        }

        {step === 4 && 
          <div>
            <button className="bg-brand" onClick={() => setStep(step - 1)}>
              이전
            </button>
            미리보기
            <button className="bg-brand" onClick={handleSubmit}>
              편찬
            </button>
          </div>
        }
      </div>
      <div>
        {step === 1 && (
          <div>
            <label>사용자 ID 입력 : </label>
            <input value = {userId} onChange={(e) => (setUserId(e.target.value))}></input>
            <button className="bg-brand" onClick={handleStoriesGet}>글 조각 가져오기</button>
            {stories && (<div>
              {stories.map((story, idx) => (
                <div key={idx}>
                  <input type='checkbox' id={story.title}/>
                  <div>{story.title}</div>
                  <div>{story.content}</div>
                </div>
              ))}
            </div>)}

          </div>
        )}

        {step === 2 && (
          <div>
            <label>제목</label>
            <input type="text" value={bookTitle} onChange={(e) => setBookTitle(e.target.value)}/>
            <br/>
            <label>태그 입력</label>
            <input placeholder="예: 청춘, 마지막, 퇴직" value={bookTags} onChange={handleTags}/>
            <br/>
            <label>내용</label>
            <textarea rows={4} value={bookContent} onChange={(e) => setBookContent(e.target.value)}/>
          </div>
        )}

        {step === 3 && (
          <div>
            <label>표지 이미지 선택</label>
            <input type="file" accept="image/*"onChange={handleImageUpload}/>
          </div>
        )}
      </div>
    </div>
  );
}
