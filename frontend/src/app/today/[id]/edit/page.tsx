"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { todayAPI } from "@/app/today/api/todayDetail";
import { useAuthWithUser } from "@/lib/hooks/tempUseAuthWithUser";

import { getMyPost, getPostDetail, updatePost } from "@/lib/api";

import type React from "react"; // Added import for React

const MAX_IMAGES = 10;

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const [previews, setPreviews] = useState<string[]>([]);

  const [deleteImageIds, setDeleteImageIds] = useState<String[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });

  useEffect(() => {
    async function fetchPost() {
      try {
        const fetchedPost = await getPostDetail(Number(params.id));
        const fetchedMyPosts = await getMyPost();

        if (!fetchedMyPosts.map((post) => post.id).includes(fetchedPost.id)) {
          router.replace(`/today/${params.id}`); // replace 사용으로 뒤로 가기 방지
          return;
        }

        console.log("불러온 게시글:", fetchedPost);

        setFormData({
          title: fetchedPost.title,
          content: fetchedPost.content,
          category: fetchedPost.category,
        });

        //   `null` 체크 후 `previews` 업데이트
        if (fetchedPost.images && fetchedPost.images.length > 0) {
          setPreviews(fetchedPost.images.slice(0, MAX_IMAGES));
        }
      } catch (error) {
        alert("게시글을 불러오는 중 오류가 발생했습니다.");
        router.push("/today");
      }
    }

    fetchPost();
  }, [params.id, router]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    setImages((prev) => {
      const newImages = [...prev];
      newImages[index] = file;
      return newImages;
    });

    setPreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews[index] = URL.createObjectURL(file);
      return newPreviews;
    });
  };

  const removeImage = (index: number) => {
    const imageToRemove = previews[index]; //   삭제할 이미지 URL 확인
    if (!imageToRemove) {
      console.warn("🚨 삭제할 이미지의 URL이 없음!");
      return;
    }

    //   S3 Key 추출 (URL에서 이미지 경로만 가져오기)
    const urlParts = imageToRemove.split("/");
    let s3Key = urlParts.slice(-2).join("/"); // 예: "posts/xxxx-xxxx-xxxx.png?..."

    //   Presigned URL의 파라미터 제거
    if (s3Key.includes("?")) {
      s3Key = s3Key.split("?")[0]; // '?' 이후의 모든 값 제거
    }

    console.log("🗑 삭제 요청할 S3 Key:", s3Key);
    setDeleteImageIds((prev) => [...prev, s3Key]); //   Presigned URL 제거 후 저장

    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    console.log("삭제할 이미지 s3Key 목록:", deleteImageIds);

    try {
      setIsSubmitting(true);

      await updatePost(
        Number(params.id),
        formData.title,
        formData.content,
        formData.category,
        deleteImageIds.length > 0 ? deleteImageIds : [],
        images.filter((img) => img !== null) as File[]
      );

      alert("게시글이 수정되었습니다.");
      router.push(`/today/${params.id}`);
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      alert("게시글 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (previews.length + images.filter(Boolean).length >= MAX_IMAGES) {
      alert(`이미지는 최대 ${MAX_IMAGES}장까지 업로드할 수 있습니다.`);
      return;
    }

    const file = files[0];
    setImages([...images, file]);
    setPreviews([...previews, URL.createObjectURL(file)]);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="px-4">
        <header className="flex items-center justify-between p-4 bg-background border-b">
          <Button
            variant="ghost"
            className="font-medium"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">게시글 수정</h1>
          <Button
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="bg-[#618264] hover:bg-[#618264]/90"
          >
            수정 완료
          </Button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger className="w-full border-[#618264]">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INFORMATION_SHARING">정보 공유</SelectItem>
              <SelectItem value="QUESTION_DISCUSSION">고민/질문</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="제목"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="border-[#618264]"
          />

          <Textarea
            placeholder="내용을 입력해주세요"
            value={formData.content}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, content: e.target.value }))
            }
            className="min-h-[300px] border-[#618264]"
          />

          {/*   이미지 개수만큼만 표시되도록 변경 */}
          <div className="grid grid-cols-3 gap-2">
            {previews.map((preview, index) =>
              preview ? (
                <div key={index} className="relative w-24 h-24">
                  <Image
                    src={preview}
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
              ) : null
            )}

            {/*   추가 버튼이 마지막 칸에 유지됨 */}
            {previews.length < MAX_IMAGES && (
              <label className="cursor-pointer w-24 h-24 border-2 border-dashed border-[#618264] rounded-lg flex flex-col items-center justify-center gap-2 text-[#618264] hover:bg-[#618264]/10">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAddImage}
                  className="hidden"
                />
                <Plus size={24} />
                <span className="text-sm">추가</span>
              </label>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
