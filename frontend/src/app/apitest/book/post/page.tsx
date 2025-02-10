"use client";

import React, { useState } from 'react';
import { makeBook } from '@/lib/api'; // Adjust the import path as needed

export default function BookCreatePage() {
  const [userId, setUserId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<{[key: string]: string}>({});
  const [tags, setTags] = useState<string[]>([]);
  const [storyIds, setStoryIds] = useState<number[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [creationStatus, setCreationStatus] = useState<{
    success: boolean | null;
    message: string;
    bookId?: string;
  }>({
    success: null,
    message: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    // 파일 존재 여부 디버깅
    console.log('Files:', files);
    
    if (files && files.length > 0) {
      const file = files[0];
      
      // 추가 디버깅 정보
      console.log('Selected file:', file);
      console.log('File name:', file.name);
      console.log('File size:', file.size);
      console.log('File type:', file.type);
      
      // 파일 유효성 검사 추가
      if (file.type.startsWith('image/')) {
        setCoverImage(file);
        console.log('Image set successfully');
      } else {
        // 이미지 파일이 아닌 경우 경고
        setCreationStatus({
          success: false,
          message: '유효한 이미지 파일을 선택해주세요.'
        });
        e.target.value = ''; // 입력 초기화
      }
    } else {
      console.log('No file selected');
      setCoverImage(null);
    }
  };

  const handleCreateBook = async () => {
    // Reset previous status
    setCreationStatus({ success: null, message: '' });

    try {
      // Validation checks
      if (!userId || !title || !coverImage) {
        setCreationStatus({
          success: false,
          message: '필수 필드를 모두 입력해주세요 (사용자 ID, 제목, 커버 이미지)'
        });
        return;
      }

      // Attempt to create the book
      const bookId = await makeBook(
        userId, 
        title, 
        content, 
        tags, 
        storyIds, 
        coverImage
      );

      // Success handling
      setCreationStatus({
        success: true,
        message: '책이 성공적으로 생성되었습니다!',
        bookId: bookId
      });

      // Optional: Reset form after successful creation
      resetForm();

    } catch (error: any) {
      // Error handling
      setCreationStatus({
        success: false,
        message: `책 생성 중 오류 발생: ${error.message}`
      });
      console.error(error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent({});
    setTags([]);
    setStoryIds([]);
    setCoverImage(null);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">새로운 봄날의 서 만들기</h1>
      
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
        <label className="block mb-2">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="봄날의 서 제목을 입력하세요"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">내용 (JSON 형식)</label>
        <textarea
          value={JSON.stringify(content)}
          onChange={(e) => {
            try {
              setContent(JSON.parse(e.target.value));
            } catch (error) {
              console.error('잘못된 JSON 형식입니다');
            }
          }}
          className="w-full p-2 border rounded"
          placeholder='내용을 JSON으로 입력하세요 (예: {"page1": "내용"})'
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">태그 (쉼표로 구분)</label>
        <input
          type="text"
          value={tags.join(', ')}
          onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
          className="w-full p-2 border rounded"
          placeholder="태그를 쉼표로 구분하여 입력하세요"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">스토리 ID (쉼표로 구분)</label>
        <input
          type="text"
          value={storyIds.join(', ')}
          onChange={(e) => setStoryIds(e.target.value.split(',').map(id => Number(id.trim())))}
          className="w-full p-2 border rounded"
          placeholder="스토리 ID를 쉼표로 구분하여 입력하세요"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">커버 이미지</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
          accept="image/*"
        />
        {coverImage && (
          <p className="mt-2 text-sm text-gray-600">
            선택된 파일: {coverImage.name}
          </p>
        )}
      </div>

      <button
        onClick={handleCreateBook}
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        봄날의 서 생성
      </button>

      {creationStatus.success !== null && (
        <div className={`mt-4 p-2 rounded ${
          creationStatus.success 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {creationStatus.message}
          {creationStatus.bookId && (
            <p className="mt-2 font-bold">생성된 책 ID: {creationStatus.bookId}</p>
          )}
        </div>
      )}
    </div>
  );
}