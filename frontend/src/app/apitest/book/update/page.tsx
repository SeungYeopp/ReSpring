'use client';

import { useState } from 'react';
import { updateBook } from '@/lib/api';

export default function UpdateBookPage() {
    const [bookId, setBookId] = useState('');
    const [userId, setUserId] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tag, setTag] = useState<string[]>([]);
    const [storyIds, setStoryIds] = useState<number[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!image) {
            setMessage('이미지를 선택해주세요.');
            return;
        }
        setLoading(true);
        try {
            const success = await updateBook(bookId, userId, title, content, tag, storyIds, image);
            setMessage(success ? '업데이트 성공!' : '업데이트 실패');
        } catch (error) {
            setMessage('업데이트 중 오류 발생');
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-xl font-bold mb-4">봄날의 서 정보 업데이트</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="text" placeholder="봄날의 서 ID" value={bookId} onChange={(e) => setBookId(e.target.value)} className="border p-2 rounded" required />
                <input type="text" placeholder="유저 ID" value={userId} onChange={(e) => setUserId(e.target.value)} className="border p-2 rounded" required />
                <input type="text" placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded" required />
                <textarea placeholder="내용" value={content} onChange={(e) => setContent(e.target.value)} className="border p-2 rounded" required />
                <input type="text" placeholder="태그 (쉼표로 구분)" onChange={(e) => setTag(e.target.value.split(','))} className="border p-2 rounded" />
                <input type="text" placeholder="스토리 ID (쉼표로 구분)" onChange={(e) => setStoryIds(e.target.value.split(',').map(Number))} className="border p-2 rounded" />
                <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 rounded" required />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={loading}>{loading ? '업데이트 중...' : '업데이트'}</button>
            </form>
            {message && <p className="mt-4 text-center">{message}</p>}
        </div>
    );
}
