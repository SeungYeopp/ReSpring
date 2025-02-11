"use client";

import React, { useState } from 'react';
import { likeOrUnlikeBook } from '@/lib/api'; // Adjust the import path as needed

export default function BookLikePage() {
  const [userId, setUserId] = useState<string>('');
  const [bookId, setBookId] = useState<number>(0);
  const [likeStatus, setLikeStatus] = useState<{
    status: string | null;
    message: string;
  }>({
    status: null,
    message: '',
  });

  const handleLikeOrUnlike = async () => {
    // Reset previous status
    setLikeStatus({ status: null, message: '' });

    try {
      // Validation checks
      if (!userId || bookId <= 0) {
        setLikeStatus({
          status: 'error',
          message: '사용자 ID와 올바른 책 ID를 입력해주세요.'
        });
        return;
      }

      // Attempt to like or unlike the book
      const result = await likeOrUnlikeBook(bookId, userId);

      // Success handling
      setLikeStatus({
        status: result,
        message: result === 'Liked' 
          ? '책을 좋아요 했습니다!' 
          : '좋아요를 취소했습니다.'
      });

    } catch (error: any) {
      // Error handling
      setLikeStatus({
        status: 'error',
        message: `좋아요 처리 중 오류 발생: ${error.message}`
      });
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">봄날의 서 좋아요</h1>
      
      <div className="mb-4">
        <label className="block mb-2">사용자 ID</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="사용자 ID를 입력하세요"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">책 ID</label>
        <input
          type="number"
          value={bookId}
          onChange={(e) => setBookId(Number(e.target.value))}
          className="w-full p-2 border rounded"
          placeholder="책 ID를 입력하세요"
        />
      </div>

      <button
        onClick={handleLikeOrUnlike}
        className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 flex items-center justify-center"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
        좋아요 / 좋아요 취소
      </button>

      {likeStatus.status !== null && (
        <div className={`mt-4 p-2 rounded flex items-center ${
          likeStatus.status === 'Liked'
            ? 'bg-red-100 text-red-800' 
            : likeStatus.status === 'Unliked'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-red-200 text-red-900'
        }`}>
          {likeStatus.status === 'Liked' && (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 mr-2 text-red-500" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                clipRule="evenodd" 
              />
            </svg>
          )}
          {likeStatus.status === 'Unliked' && (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 mr-2 text-gray-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          )}
          {likeStatus.message}
        </div>
      )}
    </div>
  );
}