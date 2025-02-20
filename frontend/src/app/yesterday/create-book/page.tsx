"use client";

import { useState, useEffect } from "react";
import {
  getAllStories,
  type Story,
  compileBookByAI,
  makeBook,
  type CompiledBook,
  type Chapter,
  type Image,
  BookFull,
} from "@/lib/api";
import { getSessionInfo, Content } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  HelpCircle,
  X,
} from "lucide-react";
import NextImage from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";

interface StoryModalProps {
  story: Story | null;
  isOpen: boolean;
  onClose: () => void;
}

const StoryModal: React.FC<StoryModalProps> = ({ story, isOpen, onClose }) => {
  if (!story) return null;

  return (
    // <Dialog open={isOpen} onOpenChange={onClose}>
    //   <DialogContent className="sm:max-w-[425px]">
    //     <DialogHeader>
    //       <DialogTitle>{story.title}</DialogTitle>
    //       <DialogDescription>
    //         {new Date(story.occurredAt).toLocaleDateString()}
    //       </DialogDescription>
    //     </DialogHeader>
    //     <div className="mt-4">
    //       <p className="text-sm mb-4">{story.content}</p>
    //       {story.images.length > 0 && (
    //         <Carousel className="w-full max-w-xs mx-auto">
    //           <CarouselContent>
    //             {story.images.map((image) => (
    //               <CarouselItem key={image}>
    //                 <div className="p-1">
    //                   <div className="flex aspect-square items-center justify-center p-6">
    //                     <NextImage
    //                       src={image}
    //                       alt={image}
    //                       width={100}
    //                       height={100}
    //                       objectFit="cover"
    //                       className="rounded-md"
    //                     />
    //                   </div>
    //                 </div>
    //               </CarouselItem>
    //             ))}
    //           </CarouselContent>
    //           <CarouselPrevious />
    //           <CarouselNext />
    //         </Carousel>
    //       )}
    //     </div>
    //   </DialogContent>
    // </Dialog>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle
            className="text-xl font-semibold truncate"
            title={story.title}
          >
            {story.title}
          </DialogTitle>
          <DialogDescription>
            {new Date(story.occurredAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow mt-4 pr-4">
          <p className="text-sm mb-4">{story.content}</p>
          {story.images.length > 0 && (
            <Carousel className="w-full max-w-xs mx-auto">
              <CarouselContent>
                {story.images.map((image) => (
                  <CarouselItem key={image}>
                    <div className="p-1">
                      <div className="flex aspect-square items-center justify-center p-6">
                        <NextImage
                          src={image || "/placeholder.svg"}
                          alt={image}
                          width={100}
                          height={100}
                          objectFit="cover"
                          className="rounded-md"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default function CreateBook() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStoryIds, setselectedStoryIds] = useState<number[]>([]);
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState<string>("...");
  const [bookTags, setBookTags] = useState<string[]>(["은퇴"]);
  const [bookCoverImg, setBookCoverImg] = useState<File>();
  const [compiledBook, setCompiledBook] = useState<CompiledBook>();
  const [generatedCompiledBookId, setGeneratedCompiledBookId] =
    useState<number>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [pages, setPages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<Image[]>([]);
  const [aiCompilationComplete, setAiCompilationComplete] = useState(false);
  const [isFinalizingBook, setIsFinalizingBook] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  const [title, setTitle] = useState<string>("");

  const router = useRouter();

  const coverImages: string[] = [];

  useEffect(() => {
    const handleInitialSettings = async () => {
      try {
        const sessionInfo = await getSessionInfo();
        const allStoriesGot = await getAllStories();
        setStories(allStoriesGot);
      } catch (error) {
        setMsg("유저의 글 조각 목록을 받아오는 데 실패하였습니다..");
        console.error(error);
      }
    };

    handleInitialSettings();
  }, []);

  useEffect(() => {
    if (compiledBook) {
      setPages(paginateContent(compiledBook.chapters, 500));
    }
  }, [compiledBook]);

  const handleTags = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tagParsed = event.target.value.split(",").map((tag) => tag.trim());
    setBookTags(tagParsed);
  };

  // const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter" && tagInput.trim() !== "") {
  //     e.preventDefault()
  //     if (!bookTags.includes(tagInput.trim())) {
  //       setBookTags([...bookTags, tagInput.trim()])
  //     }
  //     setTagInput("")
  //   }
  // }

  // (수정 후) 태그 입력 핸들러 – 입력한 태그의 UTF-8 바이트 길이가 255 이하인지 체크
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();

      // 태그를 UTF-8로 인코딩한 후 바이트 길이 계산 (varbinary(255) 기준)
      const tagBytes = new TextEncoder().encode(tagInput.trim()).length;

      // 바이트 길이가 255 초과하면 경고 후 추가하지 않음
      if (tagBytes > 255) {
        alert("태그는 최대 255바이트까지 허용됩니다.");
        return;
      }

      if (!bookTags.includes(tagInput.trim())) {
        setBookTags([...bookTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const newUrl = URL.createObjectURL(file);

    // 새로 선택한 이미지를 덮어쓰기
    setSelectedImageUrl(newUrl);
    setBookCoverImg(file);
  };

  const removeTag = (index: number) => {
    setBookTags(bookTags.filter((_, i) => i !== index));
  };

  const toggleStorySelection = (story: Story) => {
    setselectedStoryIds((prev) =>
      prev.includes(story.id)
        ? prev.filter((id) => id !== story.id)
        : [...prev, story.id]
    );
  };

  const handleSubmit = async () => {
    setIsFinalizingBook(true);
    try {
      const convertedContent = compiledBook?.chapters.reduce((acc, chapter) => {
        acc[chapter.chapterTitle] = String(chapter.content);
        return acc;
      }, {} as Content);

      const result: number = await makeBook(
        compiledBook!,
        bookTags,
        selectedStoryIds,
        bookCoverImg!
      );
      setGeneratedCompiledBookId(result);
      router.push(`/yesterday/book/${result}`);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsFinalizingBook(false);
    }
  };

  const convertStoriesToContent = (stories: Story[]): Content => {
    return stories.reduce((acc, story) => {
      acc[story.title] = String(story.content); // 문자열 변환 추가
      return acc;
    }, {} as Content);
  };

  // const normalizeContentFormat = (rawContent: any): Content => {
  //     // 이미 올바른 형태일 경우 그대로 반환
  //     if (typeof rawContent === "object" && !Array.isArray(rawContent)) {
  //         return rawContent;
  //     }

  //     // 만약 `content`가 배열이면 이를 객체 형태로 변환
  //     if (Array.isArray(rawContent["content"])) {
  //         const normalizedContent: Content = { content: {} };

  //         rawContent["content"].forEach((item: any) => {
  //             const [key, value] = Object.entries(item)[0]; // 첫 번째 키-값 쌍 가져오기
  //             normalizedContent["content"][key] = value; // 객체 형태로 변환
  //         });

  //         return normalizedContent;
  //     }

  //     // 기본적으로 기존 데이터 반환
  //     return rawContent;
  // };

  const normalizeContentFormat = (rawContent: any): Content => {
    if (Array.isArray(rawContent["content"])) {
      return {
        content: rawContent["content"].reduce((acc, item: any) => {
          const [key, value] = Object.entries(item)[0]; // 첫 번째 키-값 가져오기
          acc[key] = String(value); // 문자열로 변환
          return acc;
        }, {} as Record<string, string>),
      };
    }

    return rawContent; // 기존 구조 유지
  };

  const convertToCompiledBook = (
    title: string,
    content: Content
  ): CompiledBook => {
    // content 포맷 정규화 (배열이면 객체로 변환)
    const normalizedContent = normalizeContentFormat(content);

    const chapters: Chapter[] = Object.entries(
      normalizedContent["content"]
    ).map(([chapterTitle, chapterContent]) => ({
      chapterTitle,
      content: String(chapterContent), // 문자열 변환
    }));

    return { title, chapters };
  };

  const handleMakeAIContent = async () => {
    setIsLoading(true);
    try {
      const selectedStories = stories.filter((story) =>
        selectedStoryIds.includes(story.id)
      );

      const convertedContent = convertStoriesToContent(selectedStories);

      // const compiledBook: CompiledBook = await compileBookByAI(generatedContent)
      const generatedContent: Content = await compileBookByAI(convertedContent);

      const compiledBook: CompiledBook = convertToCompiledBook(
        title,
        generatedContent
      );

      setCompiledBook(compiledBook);
      setAiCompilationComplete(true);
      setTimeout(() => {
        setAiCompilationComplete(false);
        setStep(step + 1);
      }, 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompiledBook((prev) => ({ ...prev!, title: e.target.value }));
  };

  const handleChapterTitleChange = (chapterIdx: number, value: string) => {
    setCompiledBook((prev) => ({
      ...prev!,
      chapters: prev!.chapters.map((chapter, idx) =>
        idx === chapterIdx ? { ...chapter, chapterTitle: value } : chapter
      ),
    }));
  };

  const handleChapterContentChange = (chapterIdx: number, value: string) => {
    setCompiledBook((prev) => ({
      ...prev!,
      chapters: prev!.chapters.map((chapter, idx) =>
        idx === chapterIdx ? { ...chapter, content: value } : chapter
      ),
    }));
  };

  const onClickBackButton = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleSelectImage = (image: string) => {
    setSelectedImage(image);
  };

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
    setIsStoryModalOpen(true);
  };

  // 챕터 삭제 함수
  const handleRemoveChapter = (index: number) => {
    setCompiledBook((prev) => ({
      ...prev!,
      chapters: prev!.chapters.filter((_, i) => i !== index),
    }));
  };

  const [open, setOpen] = useState(true);

  // 처음 3초 후 자동으로 닫히도록 설정
  useEffect(() => {
    // step이 변경될 때마다 도움말을 3초 동안 자동으로 띄우고 이후 닫기
    setOpen(true);
    const timer = setTimeout(() => {
      setOpen(false);
    }, 3000);

    return () => clearTimeout(timer); // step 변경 시 기존 타이머 정리
  }, [step]);

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-1">
          <div className="flex items-center justify-between p-4 mt-12 text-white">
            <Button
              variant="ghost"
              onClick={onClickBackButton}
              className="text-white bg-brand hover:bg-brand-dark shadow-lg"
            >
              {/* <ChevronLeft className="mr-2 h-4 w-4" /> */}
              {step === 1
                ? "취소"
                : step === 4
                ? "이전"
                : step === 2
                ? "이전"
                : "이전"}
            </Button>
            <div className="flex-1 flex justify-center items-center relative">
              <span className="text-xl font-bold text-black">
                {step === 1
                  ? "글조각 선택하기"
                  : step === 2
                  ? "미리 보기"
                  : step === 3
                  ? "수정하기"
                  : "표지 선택"}
              </span>
              {/* 도움말 아이콘 */}
              <Tooltip open={open} onOpenChange={setOpen}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setOpen((prev) => !prev)} // 클릭 시 토글
                    className="focus:outline-none w-6 h-6 flex items-center justify-center ml-1"
                  >
                    <HelpCircle className="w-5 h-5 text-gray-500 hover:text-brand cursor-pointer" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom" // 기존 "right" -> "bottom"으로 변경
                  align="center" // 중앙 정렬 유지
                  className="bg-gray-800 text-white text-sm rounded-lg p-3 mt-2 shadow-lg max-w-xs w-64 z-50"
                >
                  {step == 1
                    ? "🤖 AI 도우미가 선택한 글 조각들을 하나의 이야기로 자연스럽게 엮어드려요! 엮인 글은 언제든지 수정 가능하니 걱정하지 마세요😄"
                    : step == 2
                    ? "📖 AI 도우미가 엮은 이야기를 한눈에 미리 볼 수 있어요! 아직 수정할 수 있으니 편하게 살펴보세요 😊"
                    : step == 3
                    ? "✏️ 출간 전, 최종 수정하는 단계입니다! 📚 각 챕터 내용을 확인하고, 자신만의 스타일로 봄날의 서를 완성하세요."
                    : "🌸 선택한 표지로 봄날의 서가 꾸며집니다! 📕 완성된 이야기를 확인하고, 멋진 출간을 준비하세요."}
                </TooltipContent>
              </Tooltip>
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                if (step === 1) {
                  handleMakeAIContent();
                } else if (step === 4) {
                  handleSubmit();
                } else if (step === 3) {
                  // 수정하기 단계에서 제목, 태그, 챕터 검증
                  if (!compiledBook?.title) {
                    alert("제목을 입력하세요.");
                    return;
                  }
                  if (bookTags.length === 0) {
                    alert("최소 한 개 이상의 태그를 추가하세요.");
                    return;
                  }
                  if (
                    !compiledBook?.chapters ||
                    compiledBook.chapters.length === 0
                  ) {
                    alert("최소 한 개 이상의 챕터가 필요합니다.");
                    return;
                  }
                  setStep(step + 1);
                } else {
                  setStep(step + 1);
                }
              }}
              // 수정하기 단계(step === 3)에서는 제목, 태그, 챕터 조건이 만족되지 않으면 버튼 비활성화
              disabled={
                (step === 1 && selectedStoryIds.length === 0) ||
                (step === 3 &&
                  (!compiledBook?.title ||
                    bookTags.length === 0 ||
                    compiledBook.chapters.length === 0)) ||
                (step === 4 && !compiledBook)
              }
              className={`bg-brand-light hover:bg-brand-dark text-white shadow-lg ${
                (step === 1 && selectedStoryIds.length === 0) ||
                (step === 3 &&
                  (!compiledBook?.title ||
                    bookTags.length === 0 ||
                    compiledBook.chapters.length === 0))
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {step === 1 ? "AI 엮기" : step === 4 ? "편찬" : "다음"}
            </Button>
          </div>
          <div className="p-6 relative">
            {(isLoading || isFinalizingBook) && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                  <Loader2 className="h-12 w-12 text-brand animate-spin mb-4" />
                  <p className="text-lg font-semibold">
                    {isLoading
                      ? "AI가 봄날의 서를 엮고 있어요..."
                      : "봄날의 서를 편찬하는 중입니다..."}
                  </p>
                </div>
              </div>
            )}
            {aiCompilationComplete && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                  <CheckCircle className="w-16 h-16 text-brand animate-bounce" />
                  <p className="text-lg font-semibold mt-4">AI 엮기 완료!</p>
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="mt-0 pt-0">
                {/* 안내 문구 */}
                <p className="text-center text-sm font-semibold text-gray-700 mb-6">
                  📖 봄날의 서는 내가 작성한 글 조각들로 만들어져요 ✨ <br />글
                  조각을 선택해 멋진 이야기를 시작해보세요!
                </p>

                {/* 카드 리스트 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {stories.map((story) => (
                    <Card
                      key={story.id}
                      className={`p-4 flex flex-col h-[180px] rounded-lg cursor-pointer transition-all ${
                        selectedStoryIds.includes(story.id)
                          ? "border-brand bg-brand/15"
                          : "border-gray-200"
                      }`}
                      onClick={() => toggleStorySelection(story)}
                    >
                      <div className="flex items-start space-x-4 mb-2 flex-grow overflow-hidden">
                        {/* 왼쪽: 이미지 */}
                        {/* 이미지 블록이 있을 때만 렌더링 */}
                        {story.images.length > 0 && (
                          <div className="w-16 h-16 relative flex-shrink-0">
                            <NextImage
                              src={story.images[0]} // 첫 번째 이미지를 썸네일로 사용
                              alt={story.title}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-lg"
                            />
                          </div>
                        )}

                        {/* 오른쪽: 제목 + 내용 */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-left mb-1 truncate">
                            {story.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-3 text-left">
                            {story.content}
                          </p>
                        </div>
                      </div>

                      {/* 자세히 보기 버튼 */}
                      <Button
                        className="mt-auto w-full"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStoryClick(story);
                        }}
                      >
                        자세히 보기
                      </Button>
                    </Card>
                  ))}
                </div>

                {/* 글 조각 쓰러 가는 버튼 (반응형) */}
                <div className="mt-6 text-center mb-16">
                  <Button
                    className="w-full text-sm bg-lightgreen-50 text-gray-600 border border-lightgreen-200 rounded-md py-2 px-4 transition-all duration-300 ease-in-out
                    hover:bg-lightgreen-100 hover:border-lightgreen-300 focus:ring-2 focus:ring-lightgreen-500 focus:outline-none"
                    variant="ghost"
                    onClick={() => router.push("/yesterday/writenote")}
                  >
                    🌿 마음에 드는 글 조각이 없나요? 직접 써보세요!
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && compiledBook && (
              <div className="w-full max-w-2xl mx-auto">
                <Carousel className="w-full">
                  <CarouselContent>
                    {/* {pages.map((page, index) => (
                    <CarouselItem key={index} className="p-4 text-center">
                      <p className="text-sm leading-relaxed whitespace-pre-line">{page}</p>
                    </CarouselItem>
                  ))} */}
                    {pages.map((page, index) => (
                      <CarouselItem key={index} className="p-4 text-center">
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {typeof page === "object"
                            ? JSON.stringify(page, null, 2)
                            : page}
                        </p>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    제목
                  </label>
                  <Input
                    type="text"
                    value={compiledBook?.title}
                    onChange={handleBookTitleChange}
                    placeholder="제목을 입력하세요."
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    태그
                  </label>

                  {/* 입력 필드 */}
                  <Input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="w-full p-2 border rounded-md mb-2"
                    placeholder="입력 후 Enter"
                  />

                  {/* 태그 리스트 */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {bookTags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm bg-brand-light text-white"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-1 text-xs hover:text-brand-dark"
                        >
                          ✕
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <Accordion type="multiple" className="w-full space-y-2">
                  {compiledBook?.chapters.map((chapter, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border-none bg-white rounded-lg shadow"
                    >
                      <AccordionTrigger>
                        <div className="flex items-center justify-between px-4 py-2 hover:no-underline hover:bg-gray-50 w-full">
                          <div className="flex items-center space-x-2 flex-grow">
                            <span className="text-brand-dark">
                              {index + 1}.
                            </span>
                            <Input
                              value={chapter.chapterTitle}
                              onChange={(e) =>
                                handleChapterTitleChange(index, e.target.value)
                              }
                              className="flex-grow font-semibold"
                              placeholder="챕터 제목"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation(); // 클릭 시 Accordion이 열리지 않도록 방지
                              handleRemoveChapter(index);
                            }}
                            className="text-gray-500 hover:text-red-500 cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-4 pb-4">
                        <Textarea
                          value={chapter.content}
                          onChange={(e) =>
                            handleChapterContentChange(index, e.target.value)
                          }
                          className="w-full mt-2"
                          rows={10}
                          placeholder="챕터 내용"
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <Button
                  onClick={() => {
                    setCompiledBook((prev) => ({
                      ...prev!,
                      chapters: [
                        ...prev!.chapters,
                        { chapterTitle: "새 챕터", content: "" },
                      ],
                    }));
                  }}
                  className="mt-4 bg-brand hover:bg-brand-dark text-white"
                >
                  새 챕터 추가
                </Button>
              </div>
            )}

            {step === 4 && (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <Card
                      key={index}
                      className={`cursor-pointer transition-all ${
                        selectedImage === image.imageUrl
                          ? "ring-2 ring-brand"
                          : ""
                      }`}
                      onClick={() => handleSelectImage(image.imageUrl)}
                    >
                      <div className="aspect-[2/3] relative">
                        <NextImage
                          src={image.imageUrl}
                          alt={image.imageUrl}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </div>
                    </Card>
                  ))}
                  <label
                    className="aspect-[2/3] w-48 h-72 flex items-center justify-center cursor-pointer
                 border-2 border-dashed border-gray-300 rounded-lg relative"
                  >
                    {/* 이미지가 있으면 표시, 없으면 + 아이콘 */}
                    {selectedImageUrl ? (
                      <img
                        src={selectedImageUrl}
                        alt="Cover"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Plus className="w-8 h-8 text-gray-400" />
                    )}

                    {/* 클릭 시 파일 선택창 열림 */}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
        <StoryModal
          story={selectedStory}
          isOpen={isStoryModalOpen}
          onClose={() => setIsStoryModalOpen(false)}
        />
      </div>
    </TooltipProvider>
  );
}

// 텍스트를 페이지 단위로 나누는 함수
function paginateContent(chapters: Chapter[], maxChars: number): string[] {
  const text = chapters
    .map((chapter) => `${chapter.chapterTitle}\n${chapter.content}`)
    .join("\n\n");
  const pages: string[] = [];
  let i = 0;

  while (i < text.length) {
    pages.push(text.slice(i, i + maxChars));
    i += maxChars;
  }

  return pages;
}
