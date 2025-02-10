"use client";

import { useState } from "react";
import { getTopThreeWeeklyBooks } from "@/lib/api";
import { Book } from "@/lib/api";

export default function TestPage() {
  const [userId, setUserId] = useState<string>("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!userId.trim()) {
      setError("사용자 ID를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getTopThreeWeeklyBooks(userId);
      setBooks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">이번 주 Top 3 책 검색</h1>

      {/* 사용자 ID 입력 필드 */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="사용자 ID 입력"
          className="border rounded p-2 w-64"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          검색
        </button>
      </div>

      {/* 로딩 상태 */}
      {loading && <p>로딩 중...</p>}

      {/* 오류 메시지 */}
      {error && <p className="text-red-500">{error}</p>}

      {/* 책 목록 */}
      {books.length > 0 ? (
        <ul className="space-y-4">
          {books.map((book) => (
            <li key={book.id} className="border p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-gray-600">저자 ID: {book.authorId}</p>
              <p className="text-gray-500">좋아요: {book.likeCount} | 조회수: {book.viewCount}</p>
              {book.coverImage && (
                <img src={book.coverImage} alt={book.title} className="w-32 h-40 object-cover mt-2" />
              )}
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>책 데이터가 없습니다.</p>
      )}
    </div>
  );
}
