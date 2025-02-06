"use client";

import { useState, useEffect } from "react";
import { getAllStories, Story, compileBookByAIMock, makeBook, CompiledBook } from "@/lib/api";
import { getSessionInfo } from "@/lib/api";

import { Card } from "@/components/ui/card";

export default function CreateBook() {
  const [userId, setUserId] = useState<string>("");
  const [stories, setStories] = useState<Story[]>([]); // 유저의 모든 스토리리
  const [selectedStorieIds, setSelectedStorieIds] = useState<number[]>([]);
  const [step, setStep] = useState(1);

  const [msg, setMsg] = useState<string>("...");

  const [bookTags, setBookTags] = useState<string[]>([]);
  const [bookCoverImg, setBookCoverImg] = useState<File>();
  const [compiledBook, setCompiledBook] = useState<CompiledBook>();
  const [generatedCompiledBookId, setGeneratedCompiledBookId] = useState<string>("");

  useEffect(() => {
    const handleInitialSettings = async () => {
      try{
        const sessionInfo = await getSessionInfo();

        setUserId(sessionInfo.userId); // 세션 정보를 통해 유저 ID 받아오기

        const allStoriesGot = await getAllStories(sessionInfo.userId);

        setStories(allStoriesGot);
      }catch(error){
        setMsg('유저의 글 조각 목록을 받아오는 데 실패하였습니다..');
        console.error(error);
      }
    }

    handleInitialSettings();
  }, []);

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

  const handleSelectedStories = (event : React.ChangeEvent<HTMLInputElement>) => {
    const unparsed = event.target.value;
    
    // 선택한 스토리 ID 배열..
    const parsedIds = unparsed.split(",").map((token) => (token.trim())).map((token) => parseInt(token, 10));

    setSelectedStorieIds(parsedIds);
  }

  const toggleStorySelection = (storyId : number) => {
    let isAlreadySelected = selectedStorieIds.includes(storyId);
    let newArr : number[] = selectedStorieIds;

    if(isAlreadySelected){
      newArr = newArr.filter((id) => id !==storyId)
    }else{
      newArr = [...newArr, storyId]
    }

    setSelectedStorieIds(newArr);
  }

  const handleSubmit = async () => {
    try{
      // 봄날의 서를 생성할 떄는 제목과 내용만 받는다. 따라서 내용 부분은 각 챕터를 json 형식으로 만들어서 보낸다!
      const jsonifiedBookContent = JSON.stringify(compiledBook!.chapters);

      const result = await makeBook(userId, compiledBook!.title, jsonifiedBookContent, bookTags, selectedStorieIds, bookCoverImg!);

      setGeneratedCompiledBookId(result);
    }catch(error : any){
      console.error(error);
    }
  }
  
  // AI 생성 버튼을 누르면 
  const handleMakeAIContent = async () => {
    try{
      // 선택된 글 조각들 내용 합치기.
      const selectedStories = stories.filter((story) => (selectedStorieIds.includes(story.id)));
      let joinStories = "";
      for(let i = 0;i<selectedStories.length;i++){
        joinStories += selectedStories[i].content;
      }
  
      // 글 조각 합친 것들 AI로 생성.
      const compiledBook : CompiledBook = await compileBookByAIMock(joinStories);
  
      setCompiledBook(compiledBook);
      setStep(step + 1);
    }catch(error){
      console.error(error);
    }
  }

  const handleBookTitleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const newCompiledBook = {...compiledBook, title : e.target.value} as CompiledBook;

    setCompiledBook(newCompiledBook);
  }

  const handleChapterTitleChange = (chapterIdx : number, value : string) => {
    let changedChapters = compiledBook!.chapters;

    for(let i=0;i<changedChapters!.length;i++){
      if(chapterIdx == i){
        changedChapters[i].chapterTitle = value;
      }
    }

    const newCompiledBook = {...compiledBook, chapters : changedChapters} as CompiledBook;

    setCompiledBook(newCompiledBook);
  }

  const handleChapterContentChange = (chapterIdx : number, value : string) => {
    let changedChapters = compiledBook!.chapters;

    for(let i=0;i<changedChapters!.length;i++){
      if(chapterIdx == i){
        changedChapters[i].content = value;
      }
    }

    const newCompiledBook = {...compiledBook, chapters : changedChapters} as CompiledBook;

    setCompiledBook(newCompiledBook);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex items-center justify-between bg-white p-4">
        <button className="text-brand border-2 border-brand rounded-md font-semibold px-2 py-1" onClick={() => setStep(step - 1)}>
          이전
        </button>
        <span className="text-lg font-bold">{step === 1 ? "글조각 선택하기" : step === 2 ? "미리 보기" : step === 3 ? "봄날의 서 수정하기" : "봄날의 서 표지 선택"}</span>
        <button className="text-white bg-brand-dark border-2 border-brand-dark rounded-md font-semibold px-2 py-1" onClick={() => (step === 1 ? handleMakeAIContent() : (step === 4 ? handleSubmit() : setStep(step + 1)))} disabled={step === 4 && !compiledBook}>
          {step === 1 ? "AI 엮기" : step === 4 ? "편찬" : step === 2 ? "수정" : "다음"}
        </button>
      </div>
      <div className="w-full p-4">
        {step === 1 && (
          <div className="flex flex-col gap-2">
            {stories.map((story) => (
              <Card
                key={story.id}
                className={`p-4 rounded-md cursor-pointer transition-all
                  ${selectedStorieIds.includes(story.id) ? "border-brand bg-brand/15" : "border-gray-300"}`}
                  onClick={() => toggleStorySelection(story.id)}
              >
                <div className="flex items-center">
                  <div className="w-[100px] h-[100px]">
                    <img src={story.images[0].imageUrl} className="rounded-md w-full h-full object-cover" onError={(e) => {e.currentTarget.src = '/placeholder/gardening.jpg'}}/>
                  </div>
                  <div className="flex flex-col justify-center p-2">
                    <h3 className="test-lg font-bold">{story.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{story.content}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {step === 2 && (
          <div>
            <label>제목</label>
            <input type="text" value={compiledBook?.title} onChange={handleBookTitleChange}/>
            <br/>
            <label>태그 입력</label>
            <input placeholder="예: 청춘, 마지막, 퇴직" value={bookTags} onChange={handleTags}/>
            <br/>
            {compiledBook?.chapters.map((chapter, chapterIdx) => (
              <div key={chapterIdx}>
                <label>챕터 {chapterIdx + 1} 제목 : </label>
                <input value={chapter.chapterTitle} onChange={(event) => (handleChapterTitleChange(chapterIdx, event.target.value))}></input>
                <label>챕터 내용</label>
                <textarea rows={3} value={chapter.content} onChange={(event) => (handleChapterContentChange(chapterIdx, event.target.value))}></textarea>
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div>
            <label>표지 이미지 선택</label>
            <input type="file" accept="image/*"onChange={handleImageUpload}/>
          </div>
        )}

        {step === 4 && (
          <div>
            <h1>생성된 봄날의 서 ID : {generatedCompiledBookId}</h1>
          </div>
        )}
      </div>
    </div>
  );
}
