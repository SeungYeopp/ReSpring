"use client";

import { useState } from "react";

export default function CreateBook() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    tags: [],
    content: "",
    images: [],
  });

  // 상태 업데이트 함수
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      updateFormData("images", [...formData.images, ...files]);
    }
  };

  // 백엔드에 데이터 전송
  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("content", formData.content);
    formData.tags.forEach((tag) => formDataToSend.append("tags", tag));
    formData.images.forEach((image) => formDataToSend.append("images", image));

    await fetch("/api/upload", {
      method: "POST",
      body: formDataToSend,
    });

    alert("글이 성공적으로 저장되었습니다!");
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto p-4">
      <div className="basis-1/7">
        <div className="mt-4 flex justify-between">
          {step === 1 && 
            <div>
              글조각 선택하기
              <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setStep(step + 1)}>
                다음
              </button>
            </div>
          }

          {step === 2 && 
            <div>
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setStep(step - 1)}>
                이전
              </button>
              봄날의 서 쓰기
              <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setStep(step + 1)}>
                다음
              </button>
            </div>
          }

          {step === 3 && 
            <div>
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setStep(step - 1)}>
                이전
              </button>
              표지 선택
              <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setStep(step + 1)}>
                다음
              </button>
            </div>
          }

          {step === 4 && 
            <div>
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setStep(step - 1)}>
                이전
              </button>
              미리보기
              <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={handleSubmit}>
                제출하기
              </button>
            </div>
          }
        </div>
      </div>
      <div className="basis-6/7">
        {step === 1 && (
          <div>
            <label className="block font-semibold">태그 입력</label>
            <input
              type="text"
              className="w-full border p-2 rounded mt-2"
              placeholder="예: 기술, 일상, 개발"
              value={formData.tags.join(", ")}
              onChange={(e) =>
                updateFormData("tags", e.target.value.split(",").map((tag) => tag.trim()))
              }
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block font-semibold">제목</label>
            <input
              type="text"
              className="w-full border p-2 rounded mt-2"
              placeholder="글 제목을 입력하세요"
              value={formData.title}
              onChange={(e) => updateFormData("title", e.target.value)}
            />

            <label className="block font-semibold mt-4">내용</label>
            <textarea
              className="w-full border p-2 rounded mt-2"
              rows={4}
              placeholder="글 내용을 입력하세요"
              value={formData.content}
              onChange={(e) => updateFormData("content", e.target.value)}
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="block font-semibold">표지 이미지 선택</label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="w-full border p-2 rounded mt-2"
              onChange={handleImageUpload}
            />

            <div className="mt-2">
              {formData.images.length > 0 && (
                <p className="text-sm text-gray-500">
                  {formData.images.length}개의 이미지가 선택됨
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
