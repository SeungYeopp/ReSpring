"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Camera, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  preview?: string;
}

export function ImageUpload({ onImageChange, preview }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onImageChange(acceptedFiles[0]);
      }
    },
    [onImageChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
  });

  const handleDeleteImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
  };

  return (
    <div
      {...getRootProps()}
      className={`relative w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden cursor-pointer ${isDragActive ? "border-2 border-dashed border-spring-primary" : ""}`}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={() => setIsDragging(false)}
    >
      <input {...getInputProps()} />

      {preview ? (
        <>
          <Image src={preview || "/placeholder.svg"} alt="챌린지 이미지" fill className="object-cover" />
          <button onClick={handleDeleteImage} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera className="w-16 h-16 text-gray-400 transition-transform duration-300 hover:scale-110" />
        </div>
      )}
    </div>
  );
}
