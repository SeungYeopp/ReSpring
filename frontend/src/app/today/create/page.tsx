"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "../components/ui/spinner";
import { createPost, type CreatePostDto } from "@/lib/api/today";

const MAX_IMAGES = 6; // 최대 이미지 개수

export default function WritePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // 폼 상태 관리
  const [formData, setFormData] = useState<CreatePostDto>({
    title: "",
    content: "",
    category: "",
    userId: "temp-user-id", // 실제 사용자 ID로 교체 필요
  });

  // 특정 인덱스에 이미지 추가
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0]; // 단일 파일만 선택
    const newImages = [...images];
    const newPreviews = [...previews];

    // 해당 인덱스에 이미지 추가
    newImages[index] = file;
    newPreviews[index] = URL.createObjectURL(file);

    setImages(newImages);
    setPreviews(newPreviews);
  };

  // 이미지 제거 함수
  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];

    // 해당 인덱스의 이미지와 미리보기 제거
    newImages[index] = undefined as any;
    newPreviews[index] = undefined as any;

    setImages(newImages);
    setPreviews(newPreviews);
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      // 빈 값을 제외한 실제 이미지 파일들만 필터링
      const validImages = images.filter((img) => img);

      // API 호출
      await createPost(formData, validImages);

      // 성공 시 목록 페이지로 이동
      router.push("/today");
    } catch (error) {
      console.error("게시글 작성 실패:", error);
      alert("게시글 작성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-background border-b z-10">
        <Button variant="ghost" className="font-medium" onClick={() => router.back()}>
          이전
        </Button>
        <h1 className="text-lg font-medium">새로운 글 작성</h1>
        <Button disabled={isSubmitting} onClick={handleSubmit} className="bg-[#618264] hover:bg-[#618264]/90">
          등록
        </Button>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="pt-16 pb-20 px-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 카테고리 선택 */}
          <Select value={formData.category} onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
            <SelectTrigger className="w-full border-[#618264]">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INFORMATION_SHARING">정보 공유</SelectItem>
              <SelectItem value="CAREER">커리어</SelectItem>
              <SelectItem value="LIFE">라이프</SelectItem>
              <SelectItem value="HOBBY">취미</SelectItem>
            </SelectContent>
          </Select>

          {/* 제목 입력 */}
          <Input placeholder="제목" value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} className="border-[#618264]" />

          {/* 내용 입력 */}
          <Textarea
            placeholder="내용을 입력해주세요"
            value={formData.content}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            className="min-h-[200px] border-[#618264]"
          />

          {/* 이미지 선택 그리드 */}
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: MAX_IMAGES }).map((_, index) => (
              <div key={index} className="relative aspect-square">
                {previews[index] ? (
                  // 이미지가 있는 경우
                  <>
                    <Image src={previews[index] || "/placeholder.svg"} alt={`이미지 ${index + 1}`} fill className="object-cover rounded-lg" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  // 이미지가 없는 경우
                  <label className="cursor-pointer w-full h-full">
                    <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, index)} className="hidden" />
                    <div className="w-full h-full border-2 border-dashed border-[#618264] rounded-lg flex flex-col items-center justify-center gap-2 text-[#618264] hover:bg-[#618264]/10">
                      <Plus size={24} />
                      <span className="text-sm">이미지 추가</span>
                    </div>
                  </label>
                )}
              </div>
            ))}
          </div>
        </form>
      </div>

      {/* 로딩 오버레이 */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg flex flex-col items-center">
            <Spinner className="mb-4" />
            <p className="text-gray-700">업로드 중...</p>
          </div>
        </div>
      )}
    </main>
  );
}
