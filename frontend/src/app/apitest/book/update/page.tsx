"use client";

import React, { useState } from 'react';
import { updateBook } from '@/lib/api'; // Adjust the import path as needed

export default function BookUpdatePage() {
  const [userId, setUserId] = useState<string>('');
  const [bookId, setBookId] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<{[key: string]: string}>({});
  const [tags, setTags] = useState<string[]>([]);
  const [storyIds, setStoryIds] = useState<number[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleUpdateBook = async () => {
    try {
      // Validation checks
      if (!userId || !bookId || !title || !coverImage) {
        setUpdateStatus('Please fill in all required fields');
        return;
      }

      const result = await updateBook(
        userId, 
        bookId, 
        title, 
        content, 
        tags, 
        storyIds, 
        coverImage
      );

      if (result) {
        setUpdateStatus('Book updated successfully!');
      } else {
        setUpdateStatus('Failed to update book');
      }
    } catch (error: any) {
      setUpdateStatus(`Error: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Update Book</h1>
      
      <div className="mb-4">
        <label className="block mb-2">User ID</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter User ID"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Book ID</label>
        <input
          type="number"
          value={bookId}
          onChange={(e) => setBookId(Number(e.target.value))}
          className="w-full p-2 border rounded"
          placeholder="Enter Book ID"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter Book Title"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Content (JSON format)</label>
        <textarea
          value={JSON.stringify(content)}
          onChange={(e) => {
            try {
              setContent(JSON.parse(e.target.value));
            } catch (error) {
              console.error('Invalid JSON');
            }
          }}
          className="w-full p-2 border rounded"
          placeholder='Enter content as JSON (e.g., {"page1": "Content here"})'
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Tags (comma-separated)</label>
        <input
          type="text"
          value={tags.join(', ')}
          onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
          className="w-full p-2 border rounded"
          placeholder="Enter tags separated by commas"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Story IDs (comma-separated)</label>
        <input
          type="text"
          value={storyIds.join(', ')}
          onChange={(e) => setStoryIds(e.target.value.split(',').map(id => Number(id.trim())))}
          className="w-full p-2 border rounded"
          placeholder="Enter story IDs separated by commas"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Cover Image</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
          accept="image/*"
        />
      </div>

      <button
        onClick={handleUpdateBook}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Update Book
      </button>

      {updateStatus && (
        <div className={`mt-4 p-2 rounded ${
          updateStatus.includes('successfully') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {updateStatus}
        </div>
      )}
    </div>
  );
}