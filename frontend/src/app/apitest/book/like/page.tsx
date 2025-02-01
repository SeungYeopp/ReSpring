'use client'

import { useState } from 'react';
import { likeOrUnlikeBook } from '@/lib/api'; // deleteBook 함수 경로에 맞게 조정하세요.

const TestPage = () => {
  const [bookId, setBookId] = useState('');
  const [userId, setUserId] = useState('');
  const [statusMessage, setStatusMessage] = useState('status');

  const handleLike = async () => {
    try {
      setStatusMessage('요청 보내는 중...');
      const result = await likeOrUnlikeBook(bookId, userId);

      if (result === 'Liked') {
        setStatusMessage('봄날의 서 좋아요 성공.');
      } else if(result === 'Unliked'){
        setStatusMessage('봄날의 서 안 좋아요 성공.');
      }
    } catch (error) {
      setStatusMessage(`에러 발생: ${error}`);
    }
  };

  return (
    <div>
      <h1>봄날의 서 좋아요 테스트</h1>
      <div>
        <label>
          Book ID:
          <input
            type="text"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            placeholder="봄날의 서  ID 입력"
          />
        </label>
      </div>
      <div>
        <label>
          User ID:
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="사용자 ID 입력"
          />
        </label>
      </div>
      <button onClick={handleLike}>좋아요/안좋아요</button>
      <p>{statusMessage}</p>
    </div>
  );
};

export default TestPage;
