'use client';

import { useState } from 'react';
import { getMyBooks, Book } from '@/lib/api';

export default function MyBooks() {
    const [books, setBooks] = useState<Book[]>([]);
    const [userId, setUserId] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleGet = async () => {
        try{
            const result = await getMyBooks(userId);

            setBooks(result);
        }catch(error){
            console.error(error)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">내 User ID로 모든 봄날의 서 가져오기</h1>
            <label>유저 ID : </label>
            <input value = {userId} onChange={(event) => (setUserId(event.target.value))}></input>
            <button onClick={handleGet}>입력</button>
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {books.map((book) => (
                    <div key={book.id} className="border rounded-lg p-4 shadow-md">
                        <img src={book.coverImg} alt={book.title} className="w-full h-48 object-cover rounded-md" />
                        <h2 className="text-lg font-semibold mt-2">{book.title}</h2>
                        <p className="text-sm text-gray-600">조회수: {book.view} | 좋아요: {book.likes}</p>
                        <p className="mt-2 text-sm">{book.tags.join(', ')}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
