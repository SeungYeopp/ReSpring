'use client';

import { useEffect, useState } from 'react';
import { getAllBooksSorted, Book } from '@/lib/api';

export default function SortedBooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [sortFields, setSortFields] = useState<string[]>(['view']);
    const [directions, setDirections] = useState<string[]>(['desc']);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const sortedBooks = await getAllBooksSorted(sortFields, directions);
                setBooks(sortedBooks);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchBooks();
    }, [sortFields, directions]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">정렬된 책 목록</h1>
            {error && <p className="text-red-500">{error}</p>}

            <div className="mb-4">
                <label className="mr-2">정렬 기준:</label>
                <select onChange={(e) => setSortFields([e.target.value])}>
                    <option value="view">조회수</option>
                    <option value="title">제목</option>
                    <option value="likes">좋아요</option>
                </select>

                <label className="ml-4 mr-2">정렬 방향:</label>
                <select onChange={(e) => setDirections([e.target.value])}>
                    <option value="asc">오름차순</option>
                    <option value="desc">내림차순</option>
                </select>
            </div>

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
