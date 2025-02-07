'use client';

import { useEffect, useState } from 'react';
import { searchBook, Book } from '@/lib/api';

export default function AllBooks() {
    const [books, setBooks] = useState<Book[]>([]);
    const [query, setQuery] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const result = await searchBook(query);
                setBooks(result);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchBooks();
    }, []); // 컴포넌트가 마운트 될 때 api 한 번 호출.

    const handleSearch = async () => {
        try{
            const result = await searchBook(query);
            setBooks(result);
        }catch(error){
            console.error(error);
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">봄날의 서 제목 검색</h1>
            {error && <p className="text-red-500">{error}</p>}
            <label>검색할 제목 입력 : </label>
            <input value={query} onChange={(e) => (setQuery(e.target.value))}></input>
            <button onClick={handleSearch}>검색</button>
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
