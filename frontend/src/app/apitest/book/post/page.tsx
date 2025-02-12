"use client";

import { useState } from "react";
import { CompiledBook, makeBook } from "@/lib/api"; // API 함수 가져오기

interface Content {
  [key: string]: string;
}

export default function MakeBookPage() {
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [inputs, setInputs] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
  const [tags, setTags] = useState<string[]>([]);
  const [storyIds, setStoryIds] = useState<number[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [bookId, setBookId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // 입력 필드 추가
  const addInputField = () => {
    setInputs([...inputs, { key: "", value: "" }]);
  };

  // 입력 값 변경 핸들러
  const handleChange = (index: number, field: "key" | "value", value: string) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  // 태그 입력 변경
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value.split(",").map(tag => tag.trim()));
  };

  // storyIds 입력 변경
  const handleStoryIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoryIds(e.target.value.split(",").map(id => Number(id.trim())).filter(id => !isNaN(id)));
  };

  // 커버 이미지 선택
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setCoverImage(e.target.files[0]);
    }
  };

  // API 호출
  const handleMakeBook = async () => {
    if (!userId || !title || !coverImage) {
      alert("유저 ID, 제목, 커버 이미지를 입력해주세요!");
      return;
    }

    const content: Content = inputs.reduce((acc, { key, value }) => {
      if (key.trim()) acc[key] = value;
      return acc;
    }, {} as Content);

    if (Object.keys(content).length === 0) {
      alert("최소한 하나의 컨텐츠를 입력해야 합니다.");
      return;
    }

    try {
      setLoading(true);
      // const newBookId = await makeBook(userId, title, content, tags, storyIds, coverImage);
      //setBookId(newBookId);
    } catch (error) {
      console.error("책 생성 실패:", error);
      alert("책 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">책 생성</h1>

      {/* 유저 ID 입력 */}
      <input
        type="text"
        placeholder="유저 ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      {/* 제목 입력 */}
      <input
        type="text"
        placeholder="책 제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      {/* Content 입력 필드 */}
      <h2 className="text-lg font-semibold">내용 추가</h2>
      {inputs.map((input, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="키 (예: 1장. 생일)"
            value={input.key}
            onChange={(e) => handleChange(index, "key", e.target.value)}
            className="border p-2 flex-1"
          />
          <input
            type="text"
            placeholder="값 (예: 생일은 즐겁다)"
            value={input.value}
            onChange={(e) => handleChange(index, "value", e.target.value)}
            className="border p-2 flex-1"
          />
        </div>
      ))}

      {/* 입력 필드 추가 버튼 */}
      <button onClick={addInputField} className="bg-gray-300 px-4 py-2 rounded mr-2">
        + 내용 추가
      </button>

      {/* 태그 입력 */}
      <input
        type="text"
        placeholder="태그 (쉼표로 구분)"
        onChange={handleTagsChange}
        className="border p-2 w-full mt-2 mb-2"
      />

      {/* Story IDs 입력 */}
      <input
        type="text"
        placeholder="스토리 ID (쉼표로 구분)"
        onChange={handleStoryIdsChange}
        className="border p-2 w-full mb-2"
      />

      {/* 커버 이미지 업로드 */}
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />

      {/* API 호출 버튼 */}
      <button onClick={handleMakeBook} className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? "생성 중..." : "책 생성"}
      </button>

      {/* 결과 출력 */}
      {bookId !== null && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-lg font-semibold">생성된 책 ID</h2>
          <p>{bookId}</p>
        </div>
      )}
    </div>
  );
}
