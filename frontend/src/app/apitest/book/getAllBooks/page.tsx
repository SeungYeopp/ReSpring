'use client';

import { useEffect, useState } from 'react';
import { getAllBooks, Book } from '@/lib/api';

export default function AllBooks() {
    const [books, setBooks] = useState<Book[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const topBooks = await getAllBooks();
                setBooks(topBooks);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchBooks();
    }, []); // 컴포넌트가 마운트 될 때 api 한 번 호출.

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">모든 봄날의 서</h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {books.map((book) => (
                    <div key={book.id} className="border rounded-lg p-4 shadow-md">
                        <img src={book.coverImg} alt={book.title} className="w-full h-48 object-cover rounded-md" />
                        <h2 className="text-lg font-semibold mt-2">{book.title}</h2>
                        <p className="text-sm text-gray-600">조회수: {book.view} | 좋아요: {book.likes}</p>
                        <p className="mt-2 text-sm">{book.tag.join(', ')}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
