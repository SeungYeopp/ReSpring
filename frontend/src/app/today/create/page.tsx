"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Plus, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "../components/ui/spinner";
import { createPost, type CreatePostDto } from "@/lib/api/today";

const MAX_IMAGES = 10; // 최대 이미지 업로드 개수

export default function WritePage() {
  const router = useRouter();

  // 업로드 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이미지 파일과 미리보기 URL 배열 (여러 개니까 배열)
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // 폼 데이터 상태
  const [formData, setFormData] = useState<CreatePostDto>({
    title: "",
    content: "",
    category: "",
  });

  // 이미지를 추가하는 함수
  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // 현재 이미지가 6개 이상이면 추가 안 되게 막기
    if (images.length >= MAX_IMAGES) {
      alert(`이미지는 최대 ${MAX_IMAGES}장까지 업로드할 수 있습니다.`);
      return;
    }

    // 새 이미지와 미리보기 URL 추가
    setImages((prev) => [...prev, file]);
    setPreviews((prev) => [...prev, URL.createObjectURL(file)]);
  };

  // 특정 이미지를 제거하는 함수
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
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

      // 이미지가 비어있으면 빈 배열, 있으면 파일들 그대로
      const validImages = images.length > 0 ? images : [];

      console.log("formData:", formData);
      console.log("images:", validImages);

      // 실제 서버로 전송
      await createPost(formData, validImages);

      // 성공하면 커뮤니티 메인 페이지로 이동
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
      {/* 상단 헤더 */}
      <header className="top-0 left-0 right-0 flex items-center justify-between p-4 bg-background border-b z-10">
        <Button variant="ghost" className="font-medium" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium">새로운 글 작성</h1>
        <Button disabled={isSubmitting} onClick={handleSubmit} className="bg-[#618264] hover:bg-[#618264]/90">
          등록
        </Button>
      </header>

      {/* 글 작성 폼 */}
      <div className="px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 카테고리 선택 */}
          <Select value={formData.category} onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
            <SelectTrigger className="w-full border-[#618264]">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INFORMATION_SHARING">정보 공유</SelectItem>
              <SelectItem value="QUESTION_DISCUSSION">고민/질문</SelectItem>
            </SelectContent>
          </Select>

          {/* 제목 입력 */}
          <Input placeholder="제목" value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} className="border-[#618264]" />

          {/* 내용 입력 */}
          <Textarea
            placeholder="내용을 입력해주세요"
            value={formData.content}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            className="min-h-[300px] border-[#618264]"
          />

          {/* 이미지 업로드 */}
          <div className="flex flex-wrap gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="relative w-24 h-24">
                <Image src={preview} alt={`이미지 ${index + 1}`} fill className="object-cover rounded-lg" />
                <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
                  <X size={16} />
                </button>
              </div>
            ))}

            {/* 이미지 추가 버튼 (최대 6개까지만 보이도록) */}
            {images.length < MAX_IMAGES && (
              <label className="cursor-pointer w-24 h-24 border-2 border-dashed border-[#618264] rounded-lg flex flex-col items-center justify-center gap-2 text-[#618264] hover:bg-[#618264]/10">
                <input type="file" accept="image/*" onChange={handleAddImage} className="hidden" />
                <Plus size={24} />
                <span className="text-sm">이미지 추가</span>
              </label>
            )}
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
