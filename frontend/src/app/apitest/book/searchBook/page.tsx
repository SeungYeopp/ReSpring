'use client';

import { useState } from 'react';
import { searchBook, BookInfo } from '@/lib/api';

export default function Page() {
    const [userId, setUserId] = useState('');
    const [keyword, setKeyword] = useState('');
    const [books, setBooks] = useState<BookInfo[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await searchBook(keyword, userId);

            setBooks(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Search Books</h1>
            <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID"
                className="w-full p-2 border rounded mb-4"
            />
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter Keyword"
                className="w-full p-2 border rounded mb-4"
            />
            <button
                onClick={fetchBooks}
                disabled={loading}
                className="w-full p-2 bg-blue-500 text-white rounded"
            >
                {loading ? 'Loading...' : 'Search Books'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <div className="mt-4">
                {books && books.length > 0 ? (
                    books.map((book) => (
                        <div key={book.id} className="border p-4 rounded mb-2">
                            <h2 className="text-lg font-semibold">{book.title}</h2>
                            <p className="text-sm text-gray-600">By {book.authorId}</p>
                            <img src={book.coverImage} alt={book.title} className="w-full h-40 object-cover mt-2 rounded" />
                            <p className="text-sm mt-2">Likes: {book.likeCount} | Views: {book.viewCount}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No books found.</p>
                )}
            </div>
        </div>
    );
}