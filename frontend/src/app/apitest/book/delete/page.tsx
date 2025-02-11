'use client'

import { useState } from 'react';
import { deleteBook } from '@/lib/api'; // deleteBook 함수 경로에 맞게 조정하세요.

const TestPage = () => {
  const [bookId, setBookId] = useState('');
  const [userId, setUserId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleDelete = async () => {
    try {
      setStatusMessage('삭제 중...');
      const result = await deleteBook(parseInt(bookId, 10), userId);

      if (result) {
        setStatusMessage('책이 성공적으로 삭제되었습니다.');
      } else {
        setStatusMessage('책 삭제에 실패했습니다.');
      }
    } catch (error) {
      setStatusMessage(`에러 발생: ${error}`);
    }
  };

  return (
    <div>
      <h1>봄날의 서 삭제 테스트</h1>
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
      <button onClick={handleDelete}>책 삭제</button>
      <p>{statusMessage}</p>
    </div>
  );
};

export default TestPage;
