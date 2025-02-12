"use client";

import { useState } from "react";
import { compileBookByAI } from "@/lib/api"; // API 함수 가져오기

interface Content {
  [key: string]: string;
}

export default function CompileBookPage() {
  const [inputs, setInputs] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);
  const [result, setResult] = useState<Content | null>(null);
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

  // API 호출
  const handleCompile = async () => {
    const content: Content = inputs.reduce((acc, { key, value }) => {
      if (key.trim()) acc[key] = value;
      return acc;
    }, {} as Content);

    if (Object.keys(content).length === 0) {
      alert("최소한 하나의 키를 입력해야 합니다.");
      return;
    }

    try {
      setLoading(true);
      const compiledContent = await compileBookByAI(content);
      console.log(compiledContent)
      setResult(compiledContent);
    } catch (error) {
      console.error("컴파일 실패:", error);
      alert("오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI 책 컴파일러</h1>

      {/* 입력 필드 */}
      {inputs.map((input, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="키 (예: 생일)"
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
        + 입력 추가
      </button>

      {/* API 호출 버튼 */}
      <button onClick={handleCompile} className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? "처리 중..." : "컴파일 실행"}
      </button>

      {/* 결과 출력 */}
      {result && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-lg font-semibold">결과</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
