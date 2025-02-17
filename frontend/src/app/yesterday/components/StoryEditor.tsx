"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";

interface StoryEditorProps {
  title: string;
  content: string;
  images : File[];
  onTitleChange: (newTitle: string) => void;
  onContentChange: (newContent: string) => void;
  onImagesChange: (newImages: File[]) => void;
}

const MAX_IMAGES = 6;

export default function StoryEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  onImagesChange,
}: StoryEditorProps) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTitleChange(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || images.length >= MAX_IMAGES) return;

    const newImages = [...images, ...Array.from(files)].slice(0, MAX_IMAGES);
    const newPreviews = newImages.map((file) => URL.createObjectURL(file));

    setImages(newImages);
    setPreviews(newPreviews);
    onImagesChange(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setImages(newImages);
    setPreviews(newPreviews);
    onImagesChange(newImages);
  };

  return (
    <div className="w-full p-6 space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
          제목
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="제목을 작성해주세요"
          className="w-full p-2 mt-2 border rounded-md"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-semibold text-gray-700">
          내용
        </label>
        <textarea
          id="content"
          value={content}
          onChange={handleContentChange}
          placeholder="내용을 작성해주세요"
          rows={6}
          className="w-full p-2 mt-2 border rounded-md"
        />
      </div>

      {/* 이미지 업로드 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">이미지 업로드</label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {previews.map((src, index) => (
            <div key={index} className="relative w-full aspect-square">
              <Image src={src} alt={`이미지 ${index + 1}`} fill className="object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          ))}

          {images.length < MAX_IMAGES && (
            <label className="cursor-pointer w-full h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 text-gray-600 hover:bg-gray-100">
              <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
              <Plus size={24} />
              <span className="text-sm">이미지 추가</span>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
