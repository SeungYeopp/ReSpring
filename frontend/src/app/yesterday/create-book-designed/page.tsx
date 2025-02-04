"use client";

import { useState, useEffect } from "react";
import { getAllStories, Story, compileBookByAIMock, makeBook, CompiledBook, getSessionInfo } from "@/lib/api";
import { Card } from "@/components/ui/card";
import Image from 'next/image'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Plus } from "lucide-react";
import ViewerPage from "@/app/viewer/[BookID]/page"

export default function CreateBook() {
  const [userId, setUserId] = useState<string>("");
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStoryIds, setSelectedStoryIds] = useState<number[]>([]);
  const [step, setStep] = useState(1);
  const [bookTag, setBookTag] = useState<string>("청춘");

  const [msg, setMsg] = useState<string>("...");

  const [bookTags, setBookTags] = useState<string[]>([]);
  const [bookCoverImg, setBookCoverImg] = useState<File>();
  const [compiledBook, setCompiledBook] = useState<CompiledBook>();
  const [generatedCompiledBookId, setGeneratedCompiledBookId] = useState<string>("");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // ui
  const bookUrl = '/placeholder/gardening.jpg';
  const availableTags = ["청춘", "마지막", "퇴직", "새로운 시작", "추억", "성장", "변화"];

  const coverImages = [
    "/books/book1.jpg",
    "/books/book2.jpg",
    "/books/book3.jpg",
  ];

  const [prevBtnStyle, setPrevBtnStyle] = useState<string>("opacity-0 pointer-events-none text-brand border-2 border-brand rounded-md font-semibold");

  useEffect(() => {
    const handleChangeStep = () => {
      if(step === 1){
        setPrevBtnStyle("opacity-0 pointer-events-none text-brand border-2 border-brand rounded-md font-semibold"); // 버튼 안보이게
      }else{
        setPrevBtnStyle("text-brand border-2 border-brand rounded-md font-semibold px-2 py-1"); // 버튼 보이게
      }
    }

    handleChangeStep();
  }, [step]);

  // 페이지가 처음 마운트 될 때.. userID를 getSessionID를 통해 받아온다.
  useEffect(() => {
    const handleInitialSetting = async () => {
      try{
        const sessionResult = await getSessionInfo();

        setUserId(sessionResult.userId);

        const storiesResult = await getAllStories(sessionResult.userId);

        setStories(storiesResult);
      }catch(error){
        console.error(error);
      }
    }

    handleInitialSetting();
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

  const handleSubmit = async () => {
    try{
      // 봄날의 서를 생성할 떄는 제목과 내용만 받는다. 따라서 내용 부분은 각 챕터를 json 형식으로 만들어서 보낸다!
      const jsonifiedBookContent = JSON.stringify(compiledBook!.chapters);

      const result = await makeBook(userId, compiledBook!.title, jsonifiedBookContent, [bookTag], selectedStoryIds, bookCoverImg!);

      console.log('생성된 봄날의 서 ID', result);
      setGeneratedCompiledBookId(result);
    }catch(error : any){
      console.error(error);
    }
  }
  
  // AI 생성 버튼을 누르면 
  const handleMakeAIContent = async () => {
    try{
      // 선택된 글 조각들 내용 합치기.
      const selectedStories = stories.filter((story) => (selectedStoryIds.includes(story.id)));

      console.log(selectedStories)
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

  const toggleStorySelection = (storyId: number) => {
    setSelectedStoryIds((prev) =>
      prev.includes(storyId) ? prev.filter((id) => id !== storyId) : [...prev, storyId]
    );
  };
  
  const handleSelectImage = (image: string) => {
    setSelectedImage(image);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-between bg-white p-4">
        <button className={prevBtnStyle} onClick={() => setStep(step - 1)}>
          이전
        </button>
        <span className="text-lg font-bold">{step === 1 ? "글조각 선택하기" : step === 2 ? "미리 보기" : step === 3 ? "봄날의 서 수정하기" : "봄날의 서 표지 선택"}</span>
        <button className="text-white bg-brand-dark border-2 border-brand-dark rounded-md font-semibold px-2 py-1" onClick={() => (step === 1 ? handleMakeAIContent() : (step === 4 ? handleSubmit() : setStep(step + 1)))} disabled={step === 4 && !compiledBook}>
          {step === 1 ? "AI 엮기" : step === 4 ? "편찬" : step === 2 ? "수정" : "다음"}
        </button>
      </div>
      <div className="w-5/6">
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3">
              {stories.map((story) => (
                <Card
                  key={story.id}
                  className={`p-4 border ${
                    selectedStoryIds.includes(story.id) ? "border-brand bg-brand/10" : "border-gray-300"
                  } cursor-pointer transition-all`}
                  onClick={() => toggleStorySelection(story.id)}
                >
                  <div className="flex items-center">
                    <img src={bookUrl} className="h-[100px] w-[100px] rounded-md" height={160} width={100} />
                    <div className="px-5">
                      <h3 className="text-lg font-bold">{story.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{story.content}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex items-center justify-center">
            {/*<ViewerPage params={{ BookID: "1" }}/>*/}
            <img src='/placeholder/viewer_screenshot2.jpg' width={350} />
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4 p-4">
            {/* 제목 입력 */}
            <label>제목</label>
            <input type="text" value={compiledBook?.title} onChange={handleBookTitleChange} className="border-brand border-2 rounded-sm"/>

            {/* 태그 선택 */}
            <label>태그 입력</label>
            <Select onValueChange={setBookTag} value={bookTag}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="태그를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {availableTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 챕터 입력 */}
            <Accordion type="multiple" className="w-full">
              {compiledBook?.chapters.map((chapter, chapterIdx) => (
                <AccordionItem value={`item-${chapterIdx}`}>
                  <AccordionTrigger>
                    <input
                      value={chapter.chapterTitle}
                      onChange={(event) => handleChapterTitleChange(chapterIdx, event.target.value)}
                      className="w-full"
                    />
                  </AccordionTrigger>
                  <AccordionContent>
                  <textarea
                    rows={5}
                    value={chapter.content}
                    onChange={(event) => handleChapterContentChange(chapterIdx, event.target.value)}
                    className="w-full"
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {step === 4 && (
          <div className="flex items-center justify-center flex-wrap gap-4">
            {coverImages.map((image, index) => (
              <Card
                key={index}
                className={`w-40 h-60 cursor-pointer border-2 ${
                  selectedImage === image ? "border-brand-dark" : "border-gray-300"
                }`}
                onClick={() => handleSelectImage(image)}
              >
                <img src={image} alt={`표지 ${index + 1}`} className="w-full h-full object-cover rounded" />
              </Card>
            ))}

            {/* 사용자 이미지 업로드 버튼 */}
            <label className="w-40 h-60 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded">
              <Plus className="w-8 h-8 text-gray-400" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const fileURL = URL.createObjectURL(e.target.files[0]);
                    setSelectedImage(fileURL);
                    handleImageUpload(e);
                  }
                }}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
