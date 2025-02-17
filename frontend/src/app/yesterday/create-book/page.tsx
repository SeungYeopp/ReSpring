"use client"

import { useState, useEffect } from "react"
import {
  getAllStories,
  type Story,
  compileBookByAI,
  makeBook,
  type CompiledBook,
  type Chapter,
  type Image,
  BookFull,
} from "@/lib/api"
import { getSessionInfo, Content } from "@/lib/api"
import { useRouter } from "next/navigation"
import { Plus, ChevronLeft, ChevronRight, Loader2, CheckCircle } from "lucide-react"
import NextImage from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface StoryModalProps {
  story: Story | null
  isOpen: boolean
  onClose: () => void
}

const StoryModal: React.FC<StoryModalProps> = ({ story, isOpen, onClose }) => {
  if (!story) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{story.title}</DialogTitle>
          <DialogDescription>
            Created: {new Date(story.createdAt).toLocaleDateString()}
            {story.updatedAt && ` | Updated: ${new Date(story.updatedAt).toLocaleDateString()}`}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-sm mb-4">{story.content}</p>
          {story.images.length > 0 && (
            <Carousel className="w-full max-w-xs mx-auto">
              <CarouselContent>
                {story.images.map((image) => (
                  <CarouselItem key={image}>
                    <div className="p-1">
                      <div className="flex aspect-square items-center justify-center p-6">
                        <NextImage
                          src={image}
                          alt={image}
                          width={200}
                          height={200}
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
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function CreateBook() {
  const [stories, setStories] = useState<Story[]>([])
  const [selectedStorieIds, setSelectedStorieIds] = useState<number[]>([])
  const [step, setStep] = useState(1)
  const [msg, setMsg] = useState<string>("...")
  const [bookTags, setBookTags] = useState<string[]>(["은퇴"])
  const [bookCoverImg, setBookCoverImg] = useState<File>()
  const [compiledBook, setCompiledBook] = useState<CompiledBook>()
  const [generatedCompiledBookId, setGeneratedCompiledBookId] = useState<number>()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState("")
  const [pages, setPages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<Image[]>([])
  const [aiCompilationComplete, setAiCompilationComplete] = useState(false)
  const [isFinalizingBook, setIsFinalizingBook] = useState(false)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false)

  const [title, setTitle] = useState<string>("제목")

  const router = useRouter()

  const coverImages : string[]= []

  useEffect(() => {
    const handleInitialSettings = async () => {
      try {
        const sessionInfo = await getSessionInfo()
        const allStoriesGot = await getAllStories()
        setStories(allStoriesGot)
      } catch (error) {
        setMsg("유저의 글 조각 목록을 받아오는 데 실패하였습니다..")
        console.error(error)
      }
    }

    handleInitialSettings()
  }, [])

  useEffect(() => {
    if (compiledBook) {
      setPages(paginateContent(compiledBook.chapters, 500))
    }
  }, [compiledBook])

  const handleTags = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tagParsed = event.target.value.split(",").map((tag) => tag.trim())
    setBookTags(tagParsed)
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault()
      if (!bookTags.includes(tagInput.trim())) {
        setBookTags([...bookTags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setBookCoverImg(files[0])
      // 이미지 업로드 로직 추가 (서버에 업로드 후 URL 받아오기)
      // 예시: const imageUrl = await uploadImage(files[0]);
      const imageUrl = URL.createObjectURL(files[0]) // 임시 URL 생성 (실제 구현 시 서버 업로드로 대체)
      setImages([...images, { imageId: images.length + 1, imageUrl }])
    }
  }

  const removeTag = (index: number) => {
    setBookTags(bookTags.filter((_, i) => i !== index))
  }

  const toggleStorySelection = (story: Story) => {
    setSelectedStorieIds((prev) =>
      prev.includes(story.id) ? prev.filter((id) => id !== story.id) : [...prev, story.id],
    )
  }

  const removeDotsFromTitles = (compiledBook: CompiledBook): CompiledBook => {
    // 각 챕터의 제목에서 마침표를 제거한 새 제목을 할당
    compiledBook.chapters.forEach(chapter => {
        chapter.chapterTitle = chapter.chapterTitle.replace(/\./g, ""); // 제목에서 모든 마침표 제거
    });

    return compiledBook;
};

  const handleSubmit = async () => {
    setIsFinalizingBook(true)
    try {
      //console.log(compiledBook?.chapters[0])
      //const jsonifiedBookContent = JSON.stringify(compiledBook!.chapters)

      // Chapter를 Content로 변환..
      // export interface Chapter{
      //   chapterTitle : string,
      //   content : string
      // }
      
      // interface Content {
      //     [key: string]: string;
      // }

      const convertedContent = compiledBook?.chapters.reduce((acc, chapter) => {
        acc[chapter.chapterTitle] = chapter.content;
        return acc;
      }, {} as Content);
    
      const result : number= await makeBook(
        compiledBook!,
        bookTags,
        selectedStorieIds,
        bookCoverImg!,
      )
      setGeneratedCompiledBookId(result)
      router.push(`/yesterday/newbook/${result}`)
    } catch (error: any) {
      console.error(error)
    } finally {
      setIsFinalizingBook(false)
    }
  }

  const convertStoriesToContent = (stories: Story[]): Content => {
    return stories.reduce((acc, story) => {
        acc[story.title] = story.content;
        return acc;
    }, {} as Content);
  };

  const convertToCompiledBook = (title: string, content: Content): CompiledBook => {
    const chapters: Chapter[] = Object.entries(content["content"]).map(([chapterTitle, chapterContent]) => ({
        chapterTitle,
        content: chapterContent
    }));

    return { title, chapters };
};


  const handleMakeAIContent = async () => {
    setIsLoading(true)
    try {
      const selectedStories = stories.filter((story) => selectedStorieIds.includes(story.id))

      const convertedContent = convertStoriesToContent(selectedStories)

      // const compiledBook: CompiledBook = await compileBookByAI(generatedContent)
      const generatedContent: Content = await compileBookByAI(convertedContent)

      const compiledBook : CompiledBook = convertToCompiledBook(title, generatedContent)

      setCompiledBook(compiledBook)
      setAiCompilationComplete(true)
      setTimeout(() => {
        setAiCompilationComplete(false)
        setStep(step + 1)
      }, 2000)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompiledBook((prev) => ({ ...prev!, title: e.target.value }))
  }

  const handleChapterTitleChange = (chapterIdx: number, value: string) => {
    setCompiledBook((prev) => ({
      ...prev!,
      chapters: prev!.chapters.map((chapter, idx) =>
        idx === chapterIdx ? { ...chapter, chapterTitle: value } : chapter,
      ),
    }))
  }

  const handleChapterContentChange = (chapterIdx: number, value: string) => {
    setCompiledBook((prev) => ({
      ...prev!,
      chapters: prev!.chapters.map((chapter, idx) => (idx === chapterIdx ? { ...chapter, content: value } : chapter)),
    }))
  }

  const onClickBackButton = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push("/yesterday")
    }
  }

  const handleSelectImage = (image: string) => {
    setSelectedImage(image)
  }

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story)
    setIsStoryModalOpen(true)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-8">
        <div className="flex items-center justify-between p-4 text-white">
          <Button variant="ghost" onClick={onClickBackButton} className="text-white bg-brand hover:bg-brand-dark shadow-lg">
            <ChevronLeft className="mr-2 h-4 w-4" />
            {step === 1 ? "취소" : step === 4 ? "이전" : step === 2 ? "이전" : "이전"}
          </Button>
          <span className="text-xl font-bold text-black">
            {step === 1
              ? "글조각 선택하기"
              : step === 2
                ? "미리 보기"
                : step === 3
                  ? "봄날의 서 수정하기"
                  : "봄날의 서 표지 선택"}
          </span>
          <Button
            variant="secondary"
            onClick={() => {
              if (step === 1) {
                handleMakeAIContent()
              } else if (step === 4) {
                handleSubmit()
              } else {
                setStep(step + 1)
              }
            }}
            disabled={step === 4 && !compiledBook}
            className="bg-brand-light hover:bg-brand-dark text-white shadow-lg"
          >
            {step === 1 ? "AI 엮기" : step === 4 ? "편찬" : step === 2 ? "다음" : "다음"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="p-6 relative">
          {(isLoading || isFinalizingBook) && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                <Loader2 className="h-12 w-12 text-brand animate-spin mb-4" />
                <p className="text-lg font-semibold">
                  {isLoading ? "AI가 봄날의 서를 엮고 있어요..." : "봄날의 서를 편찬하는 중입니다..."}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {stories.map((story) => (
                <Card
                  key={story.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedStorieIds.includes(story.id) ? "border-brand bg-brand/15" : "border-gray-200"
                  }`}
                  onClick={() => toggleStorySelection(story)}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 relative mb-4">
                      <NextImage
                        src={story.images[0]}
                        alt={story.images[0]}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-center mb-2">{story.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 text-center">{story.content}</p>
                  </div>
                  <Button
                    className="mt-4 w-full"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStoryClick(story)
                    }}
                  >
                    자세히 보기
                  </Button>
                </Card>
              ))}
            </div>
          )}

          {step === 2 && compiledBook && (
            <div className="w-full max-w-2xl mx-auto">
              <Carousel className="w-full">
                <CarouselContent>
                  {pages.map((page, index) => (
                    <CarouselItem key={index} className="p-4 text-center">
                      <p className="text-sm leading-relaxed whitespace-pre-line">{page}</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <Input type="text" value={compiledBook?.title} onChange={handleBookTitleChange} placeholder="제목을 입력하세요." className="w-full" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">태그 입력</label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                  {bookTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-sm bg-brand-light text-white">
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
                  <Input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="flex-1 border-none"
                    placeholder="태그 입력 후 Enter"
                  />
                </div>
              </div>

              <Accordion type="multiple" className="w-full space-y-2">
                {compiledBook?.chapters.map((chapter, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-none bg-white rounded-lg shadow">
                    <AccordionTrigger className="px-4 py-2 hover:no-underline hover:bg-gray-50">
                      <div className="flex items-center space-x-2 w-full">
                        <span className="text-brand-dark">{index + 1}.</span>
                        <Input
                          value={chapter.chapterTitle}
                          onChange={(e) => handleChapterTitleChange(index, e.target.value)}
                          className="flex-grow font-semibold"
                          placeholder="챕터 제목"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <Textarea
                        value={chapter.content}
                        onChange={(e) => handleChapterContentChange(index, e.target.value)}
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
                    chapters: [...prev!.chapters, { chapterTitle: "새 챕터", content: "" }],
                  }))
                }}
                className="mt-4 bg-brand hover:bg-brand-dark text-white"
              >
                새 챕터 추가
              </Button>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {coverImages.map((image, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all ${selectedImage === image ? "ring-2 ring-brand" : ""}`}
                    onClick={() => handleSelectImage(image)}
                  >
                    <div className="aspect-[2/3] relative">
                      <NextImage
                        src={image}
                        alt={image}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                  </Card>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all ${
                      selectedImage === image.imageUrl ? "ring-2 ring-brand" : ""
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
                <label className="aspect-[2/3] flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg">
                  <Plus className="w-8 h-8 text-gray-400" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
      <StoryModal story={selectedStory} isOpen={isStoryModalOpen} onClose={() => setIsStoryModalOpen(false)} />
    </div>
  )
}

// 텍스트를 페이지 단위로 나누는 함수
function paginateContent(chapters: Chapter[], maxChars: number): string[] {
  const text = chapters.map((chapter) => `${chapter.chapterTitle}\n${chapter.content}`).join("\n\n")
  const pages: string[] = []
  let i = 0

  while (i < text.length) {
    pages.push(text.slice(i, i + maxChars))
    i += maxChars
  }

  return pages
}

