"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { todayAPI } from "@/app/today/api/todayDetail";
import { useAuthWithUser } from "@/lib/hooks/tempUseAuthWithUser";

import {getPostDetail, updatePost} from "@/lib/api"

import type React from "react"; // Added import for React

import {useAuth} from "@/hooks/useAuth"

const MAX_IMAGES = 6;

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const {userId} = useAuth(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<(File | null)[]>(Array(MAX_IMAGES).fill(null));
  const [previews, setPreviews] = useState<({ imageId: number; imageUrl: string } | null)[]>(Array(MAX_IMAGES).fill(null));
  const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    userId: "",
  });

  useEffect(() => {
    if (!userId) return; // userId가 없으면 fetch 안 함

    async function fetchPost() {
      try {
        const fetchedPost = await getPostDetail(Number(params.id));
        console.log('fetchedPost.userId', fetchedPost.userId)
        console.log('userId', userId)
        if (fetchedPost.userId !== userId) {
          router.replace(`/today/${params.id}`); // replace 사용으로 뒤로 가기 방지
          return;
        }

        console.log("불러온 게시글:", fetchedPost);

        setFormData({
          title: fetchedPost.title,
          content: fetchedPost.content,
          category: fetchedPost.category,
          userId: fetchedPost.userId,
        });

        if (fetchedPost.images.length > 0) {
          const newPreviews = Array(MAX_IMAGES).fill(null);
          fetchedPost.images.forEach((img, index) => {
            if (index < MAX_IMAGES) {
              newPreviews[index] = img;
            }
          });
          setPreviews(newPreviews);
        }
      } catch (error) {
        alert("게시글을 불러오는 중 오류가 발생했습니다.");
        router.push("/today");
      }
    }

    fetchPost();
  }, [params.id, userId, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
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
      newPreviews[index] = { imageId: Date.now(), imageUrl: URL.createObjectURL(file) };
      return newPreviews;
    });
  };

  const removeImage = (index: number) => {
    const imageToRemove = previews[index];
    if (imageToRemove && "imageId" in imageToRemove) {
      setDeleteImageIds((prev) => [...prev, imageToRemove.imageId]);
    }

    setImages((prev) => {
      const newImages = [...prev];
      newImages[index] = null;
      return newImages;
    });

    setPreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews[index] = null;
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      await updatePost(Number(params.id), formData.title, formData.content, formData.category, deleteImageIds, images.filter((img) => img !== null) as File[]);

      alert("게시글이 수정되었습니다.");
      router.push(`/today/${params.id}`);
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      alert("게시글 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Select value={formData.category} onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
            <SelectTrigger className="w-full border-[#618264]">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INFORMATION_SHARING">정보 공유</SelectItem>
              <SelectItem value="CAREER">고민/질문</SelectItem>
            </SelectContent>
          </Select>

          <Input placeholder="제목" value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} className="border-[#618264]" />

          <Textarea
            placeholder="내용을 입력해주세요"
            value={formData.content}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            className="min-h-[300px] border-[#618264]"
          />

          <div className="grid grid-cols-3 gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="relative aspect-square">
                {preview ? (
                  <>
                    {/* 이미지 변경해야 함 */}
                    <Image src={"/corgis/placeholder1.jpg"} alt={`이미지 ${index + 1}`} fill className="object-cover rounded-lg" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <label className="flex items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer">
                    <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, index)} className="hidden" />
                    <Plus size={24} className="text-gray-400" />
                  </label>
                )}
              </div>
            ))}
          </div>
        </form>
      </div>
    </main>
  );
}
