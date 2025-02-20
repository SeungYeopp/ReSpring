// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { Plus, X } from "lucide-react";

// export interface StoryEditorProps {
//   title: string;
//   content: string;
//   onTitleChange: (newTitle: string) => void;
//   onContentChange: (newContent: string) => void;
//   /** 새로 업로드한 이미지 파일들 */
//   newImages: File[];
//   onNewImagesChange: (files: File[]) => void;
//   /** 서버에 이미 있는 기존 이미지 URL들 */
//   existingImageUrls: string[];
//   onExistingImageUrlsChange: (urls: string[]) => void;
//   /**
//    * 삭제할 기존 이미지의 S3 Key(또는 식별자)를 업데이트하는 함수
//    * (예를 들어, 부모에서 setDeleteImageIds를 전달)
//    */
//   onDeleteImageIdsChange: (
//     ids: string[] | ((prevIds: string[]) => string[])
//   ) => void;
// }

// const MAX_IMAGES = 6;

// export default function StoryEditor({
//   title,
//   content,
//   onTitleChange,
//   onContentChange,
//   newImages,
//   onNewImagesChange,
//   existingImageUrls,
//   onExistingImageUrlsChange,
//   onDeleteImageIdsChange,
// }: StoryEditorProps) {
//   // 새 이미지 File 객체로부터 생성한 미리보기 URL들을 관리하는 state
//   const [newPreviews, setNewPreviews] = useState<string[]>([]);

//   // newImages가 변경될 때마다 preview URL 생성 (메모리 누수를 방지하려면 revokeObjectURL 처리)
//   useEffect(() => {
//     const previews = newImages.map((file) => URL.createObjectURL(file));
//     setNewPreviews(previews);

//     return () => {
//       previews.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [newImages]);

//   const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     onTitleChange(e.target.value);
//   };

//   const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     onContentChange(e.target.value);
//   };

//   // 새 이미지를 추가 (추가 가능한 슬롯: MAX_IMAGES - (기존이미지 + 새이미지))
//   const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;
//     const filesArray = Array.from(files);
//     const totalCount = existingImageUrls.length + newImages.length;
//     const availableSlots = MAX_IMAGES - totalCount;
//     if (filesArray.length > availableSlots) {
//       alert(`이미지는 최대 ${MAX_IMAGES}장까지 업로드할 수 있습니다.`);
//       return;
//     }
//     onNewImagesChange([...newImages, ...filesArray]);
//   };

//   const removeExistingImage = (index: number) => {
//     const urlToRemove = existingImageUrls[index];
//     if (!urlToRemove) {
//       console.warn("🚨 삭제할 이미지의 URL이 없음!");
//       return;
//     }
//     // URL API를 사용하여 pathname 추출
//     const pathname = new URL(urlToRemove).pathname;
//     const s3Key = pathname.startsWith("/") ? pathname.slice(1) : pathname;

//     // onDeleteImageIdsChange prop을 사용하여 업데이트
//     onDeleteImageIdsChange((prev) => {
//       const newIds = [...prev, s3Key];
//       return newIds;
//     });

//     const updatedExisting = existingImageUrls.filter((_, i) => i !== index);

//     onExistingImageUrlsChange(updatedExisting);
//   };

//   // 새 이미지 삭제
//   const removeNewImage = (index: number) => {
//     const updatedNewImages = newImages.filter((_, i) => i !== index);
//     onNewImagesChange(updatedNewImages);
//   };

//   const totalImagesCount = existingImageUrls.length + newImages.length;

//   return (
//     <div className="w-full p-6 space-y-4">
//       {/* 제목 입력 */}
//       <div>
//         <label
//           htmlFor="title"
//           className="block text-sm font-semibold text-gray-700"
//         >
//           제목
//         </label>
//         <input
//           id="title"
//           type="text"
//           value={title}
//           onChange={handleTitleChange}
//           placeholder="제목을 작성해주세요"
//           className="w-full p-2 mt-2 border rounded-md"
//         />
//       </div>

//       {/* 내용 입력 */}
//       <div>
//         <label
//           htmlFor="content"
//           className="block text-sm font-semibold text-gray-700"
//         >
//           내용
//         </label>
//         <textarea
//           id="content"
//           value={content}
//           onChange={handleContentChange}
//           placeholder="내용을 작성해주세요"
//           rows={6}
//           className="w-full p-2 mt-2 border rounded-md"
//         />
//       </div>

//       {/* 이미지 업로드 영역 */}
//       <div>
//         <label className="block text-sm font-semibold text-gray-700">
//           이미지 업로드
//         </label>
//         <div className="grid grid-cols-3 gap-2 mt-2">
//           {/* 서버에서 받아온 기존 이미지 */}
//           {existingImageUrls.map((src, index) => (
//             <div
//               key={`existing-${index}`}
//               className="relative w-full aspect-square"
//             >
//               <Image
//                 src={src}
//                 alt={`이미지 ${index + 1}`}
//                 fill
//                 className="object-cover rounded-lg"
//               />
//               <button
//                 type="button"
//                 onClick={() => removeExistingImage(index)}
//                 className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           ))}

//           {/* 새로 추가한 이미지 미리보기 */}
//           {newPreviews.map((src, index) => (
//             <div key={`new-${index}`} className="relative w-full aspect-square">
//               <Image
//                 src={src}
//                 alt={`새 이미지 ${index + 1}`}
//                 fill
//                 className="object-cover rounded-lg"
//               />
//               <button
//                 type="button"
//                 onClick={() => removeNewImage(index)}
//                 className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           ))}

//           {/* 이미지 추가 버튼 (총 이미지 수가 MAX_IMAGES 미만일 경우) */}
//           {totalImagesCount < MAX_IMAGES && (
//             <label className="cursor-pointer w-full h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 text-gray-600 hover:bg-gray-100">
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleNewImageChange}
//                 className="hidden"
//               />
//               <Plus size={24} />
//               <span className="text-sm">이미지 추가</span>
//             </label>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, X } from "lucide-react"

export interface StoryEditorProps {
  title: string
  content: string
  onTitleChange: (newTitle: string) => void
  onContentChange: (newContent: string) => void
  newImages: File[]
  onNewImagesChange: (files: File[]) => void
  existingImageUrls: string[]
  onExistingImageUrlsChange: (urls: string[]) => void
  onDeleteImageIdsChange: (ids: string[] | ((prevIds: string[]) => string[])) => void
}

const MAX_IMAGES = 6
const MAX_CHAR_LENGTH = 255

export default function StoryEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  newImages,
  onNewImagesChange,
  existingImageUrls,
  onExistingImageUrlsChange,
  onDeleteImageIdsChange,
}: StoryEditorProps) {
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [titleError, setTitleError] = useState("")
  const [contentError, setContentError] = useState("")

  useEffect(() => {
    const previews = newImages.map((file) => URL.createObjectURL(file))
    setNewPreviews(previews)

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [newImages])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    if (newTitle.length <= MAX_CHAR_LENGTH) {
      onTitleChange(newTitle)
      setTitleError("")
    } else {
      setTitleError(`제목은 ${MAX_CHAR_LENGTH}자를 초과할 수 없습니다.`)
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    if (newContent.length <= MAX_CHAR_LENGTH) {
      onContentChange(newContent)
      setContentError("")
    } else {
      setContentError(`내용은 ${MAX_CHAR_LENGTH}자를 초과할 수 없습니다.`)
    }
  }

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const filesArray = Array.from(files)
    const totalCount = existingImageUrls.length + newImages.length
    const availableSlots = MAX_IMAGES - totalCount
    if (filesArray.length > availableSlots) {
      alert(`이미지는 최대 ${MAX_IMAGES}장까지 업로드할 수 있습니다.`)
      return
    }
    onNewImagesChange([...newImages, ...filesArray])
  }

  const removeExistingImage = (index: number) => {
    const urlToRemove = existingImageUrls[index]
    if (!urlToRemove) {
      console.warn("🚨 삭제할 이미지의 URL이 없음!")
      return
    }
    const pathname = new URL(urlToRemove).pathname
    const s3Key = pathname.startsWith("/") ? pathname.slice(1) : pathname

    onDeleteImageIdsChange((prev) => [...prev, s3Key])

    const updatedExisting = existingImageUrls.filter((_, i) => i !== index)
    onExistingImageUrlsChange(updatedExisting)
  }

  const removeNewImage = (index: number) => {
    const updatedNewImages = newImages.filter((_, i) => i !== index)
    onNewImagesChange(updatedNewImages)
  }

  const totalImagesCount = existingImageUrls.length + newImages.length

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
        {titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}
        <p className="text-sm text-gray-500 mt-1">
          {title.length}/{MAX_CHAR_LENGTH}
        </p>
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
        {contentError && <p className="text-red-500 text-sm mt-1">{contentError}</p>}
        <p className="text-sm text-gray-500 mt-1">
          {content.length}/{MAX_CHAR_LENGTH}
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">이미지 업로드</label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {existingImageUrls.map((src, index) => (
            <div key={`existing-${index}`} className="relative w-full aspect-square">
              <Image
                src={src || "/placeholder.svg"}
                alt={`이미지 ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeExistingImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          ))}

          {newPreviews.map((src, index) => (
            <div key={`new-${index}`} className="relative w-full aspect-square">
              <Image
                src={src || "/placeholder.svg"}
                alt={`새 이미지 ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeNewImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          ))}

          {totalImagesCount < MAX_IMAGES && (
            <label className="cursor-pointer w-full h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 text-gray-600 hover:bg-gray-100">
              <input type="file" accept="image/*" multiple onChange={handleNewImageChange} className="hidden" />
              <Plus size={24} />
              <span className="text-sm">이미지 추가</span>
            </label>
          )}
        </div>
      </div>
    </div>
  )
}

