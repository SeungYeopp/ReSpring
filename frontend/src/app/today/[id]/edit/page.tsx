"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { getMyPost, getPostDetail, updatePost } from "@/lib/api"

import type React from "react" // Added import for React

// 데이터베이스 스키마 기반 최대 길이 제한
const MAX_IMAGES = 10
const MAX_TITLE_LENGTH = 50 // VARCHAR(50)
const MAX_CONTENT_LENGTH = 500 // VARCHAR(500)
const MAX_CATEGORY_LENGTH = 20 // VARCHAR(20)

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<File[]>([])

  const [previews, setPreviews] = useState<string[]>([])

  const [deleteImageIds, setDeleteImageIds] = useState<string[]>([])

  // 유효성 검사 에러 메시지를 저장하는 상태
  const [validationErrors, setValidationErrors] = useState({
    title: "",
    content: "",
    category: "",
  })

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  })

  const [charCount, setCharCount] = useState({
    title: 0,
    content: 0,
  })

  // formData 변경 함수 수정
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setCharCount((prev) => ({ ...prev, [name]: value.length }))
  }

  useEffect(() => {
    async function fetchPost() {
      try {
        const fetchedPost = await getPostDetail(Number(params.id))
        const fetchedMyPosts = await getMyPost()

        if (!fetchedMyPosts.map((post) => post.id).includes(fetchedPost.id)) {
          router.replace(`/today/${params.id}`) // replace 사용으로 뒤로 가기 방지
          return
        }

        setFormData({
          title: fetchedPost.title,
          content: fetchedPost.content,
          category: fetchedPost.category,
        })

        // 글자 수 초기화
        setCharCount({
          title: fetchedPost.title.length,
          content: fetchedPost.content.length,
        })

        //   `null` 체크 후 `previews` 업데이트
        if (fetchedPost.images && fetchedPost.images.length > 0) {
          setPreviews(fetchedPost.images.slice(0, MAX_IMAGES))
        }
      } catch (error) {
        alert("게시글을 불러오는 중 오류가 발생했습니다.")
        router.push("/today")
      }
    }

    fetchPost()
  }, [params.id, router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    setImages((prev) => {
      const newImages = [...prev]
      newImages[index] = file
      return newImages
    })

    setPreviews((prev) => {
      const newPreviews = [...prev]
      newPreviews[index] = URL.createObjectURL(file)
      return newPreviews
    })
  }

  const removeImage = (index: number) => {
    const imageToRemove = previews[index] //   삭제할 이미지 URL 확인
    if (!imageToRemove) {
      console.warn("🚨 삭제할 이미지의 URL이 없음!")
      return
    }

    //   S3 Key 추출 (URL에서 이미지 경로만 가져오기)
    const urlParts = imageToRemove.split("/")
    let s3Key = urlParts.slice(-2).join("/") // 예: "posts/xxxx-xxxx-xxxx.png?..."

    //   Presigned URL의 파라미터 제거
    if (s3Key.includes("?")) {
      s3Key = s3Key.split("?")[0] // '?' 이후의 모든 값 제거
    }

    setDeleteImageIds((prev) => [...prev, s3Key]) //   Presigned URL 제거 후 저장

    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // 폼 데이터 유효성 검사 함수
  const validateForm = () => {
    const errors = {
      title: "",
      content: "",
      category: "",
    }

    // 제목 유효성 검사 (필수 입력 & 최대 50자)
    if (!formData.title.trim()) {
      errors.title = "제목을 입력해주세요."
    } else if (formData.title.length > MAX_TITLE_LENGTH) {
      errors.title = `제목은 ${MAX_TITLE_LENGTH}자 이내로 입력해주세요.`
    }

    // 내용 유효성 검사 (필수 입력 & 최대 500자)
    if (!formData.content.trim()) {
      errors.content = "내용을 입력해주세요."
    } else if (formData.content.length > MAX_CONTENT_LENGTH) {
      errors.content = `내용은 ${MAX_CONTENT_LENGTH}자 이내로 입력해주세요.`
    }

    // 카테고리 유효성 검사 (필수 선택 & 최대 20자)
    if (!formData.category) {
      errors.category = "카테고리를 선택해주세요."
    } else if (formData.category.length > MAX_CATEGORY_LENGTH) {
      errors.category = `카테고리는 ${MAX_CATEGORY_LENGTH}자 이내여야 합니다.`
    }

    setValidationErrors(errors)
    return !Object.values(errors).some((error) => error !== "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 폼 유효성 검사 실행
    if (!validateForm()) {
      return // 유효성 검사 실패시 제출 중단
    }

    try {
      setIsSubmitting(true)

      await updatePost(
        Number(params.id),
        formData.title,
        formData.content,
        formData.category,
        deleteImageIds.length > 0 ? deleteImageIds : [],
        images.filter((img) => img !== null) as File[],
      )

      alert("게시글이 수정되었습니다.")
      router.push(`/today/${params.id}`)
    } catch (error) {
      console.error("게시글 수정 실패:", error)
      alert("게시글 수정에 실패했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (previews.length + images.filter(Boolean).length >= MAX_IMAGES) {
      alert(`이미지는 최대 ${MAX_IMAGES}장까지 업로드할 수 있습니다.`)
      return
    }

    const file = files[0]
    setImages([...images, file])
    setPreviews([...previews, URL.createObjectURL(file)])
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="px-4">
        <header className="flex items-center justify-between p-4 bg-background border-b">
          <Button variant="ghost" className="font-medium" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">게시글 수정</h1>
          <Button disabled={isSubmitting} onClick={handleSubmit} className="bg-[#618264] hover:bg-[#618264]/90">
            수정 완료
          </Button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="w-full border-[#618264]">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INFORMATION_SHARING">정보 공유</SelectItem>
                <SelectItem value="QUESTION_DISCUSSION">고민/질문</SelectItem>
              </SelectContent>
            </Select>
            {/* 카테고리 에러 메시지 표시 */}
            {validationErrors.category && <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>}
          </div>

          <div>
            <Input
              placeholder="제목"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="border-[#618264]"
            />
            <p className="text-sm text-gray-500 mt-1">
              {charCount.title}/{MAX_TITLE_LENGTH} 자
            </p>
            {validationErrors.title && <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>}
          </div>

          <div>
            <Textarea
              placeholder="내용을 입력해주세요"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="min-h-[300px] border-[#618264]"
            />
            <p className="text-sm text-gray-500 mt-1">
              {charCount.content}/{MAX_CONTENT_LENGTH} 자
            </p>
            {validationErrors.content && <p className="text-red-500 text-sm mt-1">{validationErrors.content}</p>}
          </div>

          {/*   이미지 개수만큼만 표시되도록 변경 */}
          <div className="grid grid-cols-3 gap-2">
            {previews.map((preview, index) =>
              preview ? (
                <div key={index} className="relative w-24 h-24">
                  <Image
                    src={preview || "/placeholder.svg"}
                    alt={`이미지 ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : null,
            )}

            {/*   추가 버튼이 마지막 칸에 유지됨 */}
            {previews.length < MAX_IMAGES && (
              <label className="cursor-pointer w-24 h-24 border-2 border-dashed border-[#618264] rounded-lg flex flex-col items-center justify-center gap-2 text-[#618264] hover:bg-[#618264]/10">
                <input type="file" accept="image/*" onChange={handleAddImage} className="hidden" />
                <Plus size={24} />
                <span className="text-sm">추가</span>
              </label>
            )}
          </div>
        </form>
      </div>
    </main>
  )
}

