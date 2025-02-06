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

export default function CreateBook() {
  const [userId, setUserId] = useState<string>("");
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStoryIds, setSelectedStoryIds] = useState<number[]>([]);
  const [step, setStep] = useState(1);
  const [bookTag, setBookTag] = useState<string>("청춘");

  const [bookTags, setBookTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [msg, setMsg] = useState<string>("...");

  const [bookCoverImg, setBookCoverImg] = useState<File>();
  const [compiledBook, setCompiledBook] = useState<CompiledBook>();
  const [generatedCompiledBookId, setGeneratedCompiledBookId] = useState<string>("");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // ui
  const bookUrl = '/placeholder/gardening.jpg';
  const availableTags = ["청춘", "마지막", "퇴직", "새로운 시작", "추억", "성장", "변화"];

  const coverImages = [
    "/corgis/placeholder7.jpg",
    "/corgis/placeholder4.jpg",
    "/corgis/placeholder1.jpg",
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

  const handleTagKeyDown = (e : React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!bookTags.includes(tagInput.trim())) {
        setBookTags([...bookTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };
  
  const removeTag = (index : number) => {
    setBookTags(bookTags.filter((_, i) => i !== index));
  };

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
      <div className="w-full flex items-center justify-center bg-white p-4">
        <button className="text-brand w-20 border-2 border-brand rounded-md font-semibold px-2 py-1" onClick={() => setStep(step - 1)}>
          이전
        </button>
        <span className="text-md font-bold w-2/4 text-center">{step === 1 ? "글조각 선택하기" : step === 2 ? "미리 보기" : step === 3 ? "봄날의 서 수정하기" : "봄날의 서 표지 선택"}</span>
        <button className="w-20 text-white bg-brand-dark border-2 border-brand-dark rounded-md font-semibold px-2 py-1" onClick={() => (step === 1 ? handleMakeAIContent() : (step === 4 ? handleSubmit() : setStep(step + 1)))} disabled={step === 4 && !compiledBook}>
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
                      <h3 className="text-md font-bold">{story.title}</h3>
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
            여기에 미리보기 입력..
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4 p-4">
            {/* 제목 입력 */}
            <label>제목</label>
            <input
              type="text"
              value={compiledBook?.title}
              onChange={handleBookTitleChange}
              className="border-brand border-2 rounded-sm p-2"
            />

            {/* 태그 입력 */}
            <label>태그 입력</label>
            <div className="border border-brand p-2 rounded-sm flex flex-wrap gap-2">
              {bookTags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-brand text-white px-2 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-1 text-xs"
                  >
                    ✕
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="border-none focus:ring-0 p-1 outline-none flex-1"
                placeholder="태그 입력 후 Enter"
              />
            </div>

            {/* 챕터 입력 */}
            <Accordion type="multiple" className="w-full">
              {compiledBook?.chapters.map((chapter, chapterIdx) => (
                <AccordionItem key={chapterIdx} value={`item-${chapterIdx}`}>
                  <AccordionTrigger>
                    <input
                      value={chapter.chapterTitle}
                      onChange={(event) =>
                        handleChapterTitleChange(chapterIdx, event.target.value)
                      }
                      className="w-full"
                    />
                  </AccordionTrigger>
                  <AccordionContent>
                    <textarea
                      rows={5}
                      value={chapter.content}
                      onChange={(event) =>
                        handleChapterContentChange(chapterIdx, event.target.value)
                      }
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
                className={`w-[120px] h-[180px] cursor-pointer border-2 ${
                  selectedImage === image ? "border-brand-dark" : "border-gray-300"
                }`}
                onClick={() => handleSelectImage(image)}
              >
                <img src={image} onError = {(e) => (e.currentTarget.src = '/corgis/placeholder7.jpg')} alt={`표지 ${index + 1}`} className="w-full h-full object-cover rounded" />
              </Card>
            ))}

            {/* 사용자 이미지 업로드 버튼 */}
            <label className="w-[120px] h-[180px] flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded">
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
