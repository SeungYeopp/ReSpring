'use client';

import React, { useState } from 'react';
import { Book, Content, Comment } from '@/lib/api'; // 기존 타입 import
import { getBookById } from '@/lib/api'; // 기존 함수 import

export default function BookDetailsPage() {
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Input states
  const [bookId, setBookId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  async function handleFetchBook() {
    // Validate inputs
    if (!bookId || !userId) {
      setError('Both Book ID and User ID are required');
      return;
    }

    try {
      setLoading(true);
      const fetchedBook : Book = await getBookById(Number(bookId), userId);
      console.log(fetchedBook.coverImage)
      setBook(fetchedBook);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setBook(null);
    } finally {
      setLoading(false);
    }
  }

  function renderBookDetails() {
    if (loading) {
      return <div className="p-4 text-center">Loading book details...</div>;
    }

    if (error) {
      return (
        <div className="p-4 text-red-500">
          Error loading book: {error}
        </div>
      );
    }

    if (!book) {
      return <div className="p-4">No book found. Enter Book ID and User ID to search.</div>;
    }

    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex">
          {/* Book Cover */}
          {book.coverImage && (
            <img 
              src={book.coverImage} 
              alt={book.coverImage} 
              className="w-64 h-96 object-cover mr-6"
            />
          )}

          {/* Book Details */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
            
            <div className="mb-4">
              <strong>Tags:</strong> {book.tags.join(', ')}
            </div>

            <div className="mb-4">
              <p>Created: {book.createdAt.toLocaleDateString()}</p>
              <p>Updated: {book.updatedAt.toLocaleDateString()}</p>
            </div>

            <div className="mb-4">
              <strong>Likes:</strong> {book.likeCount}
              <strong className="ml-4">Views:</strong> {book.viewCount}
            </div>

            {/* Book Content */}
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">Content</h2>
              {Object.entries(book.content).map(([chapter, content]) => (
                <div key={chapter} className="mb-4">
                  <h3 className="text-lg font-semibold">{chapter}</h3>
                  <p>{content}</p>
                </div>
              ))}
            </div>

            {/* Comments Section */}
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">Comments ({book.comments.length})</h2>
              {book.comments.map((comment) => (
                <div 
                  key={comment.id} 
                  className="border-b py-2"
                >
                  <div className="flex justify-between">
                    <strong>{comment.username}</strong>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex mb-4 space-x-4">
        <input 
          type="text" 
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          placeholder="Enter Book ID" 
          className="border p-2 flex-1"
        />
        <input 
          type="text" 
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID" 
          className="border p-2 flex-1"
        />
        <button 
          onClick={handleFetchBook}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Fetch Book
        </button>
      </div>

      {renderBookDetails()}
    </div>
  );
}