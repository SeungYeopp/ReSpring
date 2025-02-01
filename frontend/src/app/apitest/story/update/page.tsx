'use client';

import { useState } from 'react';
import { updateStory, Story } from '@/lib/api';

export default function UpdateStoryPage() {
    const [storyId, setStoryId] = useState('');
    const [userId, setUserId] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [eventId, setEventId] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [updatedStory, setUpdatedStory] = useState<Story | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setImages(Array.from(event.target.files));
        }
    };

    const handleSubmit = async () => {
        if (!storyId || !userId || !title || !content || !eventId) {
            setMessage('모든 필드를 입력하세요.');
            return;
        }

        setLoading(true);
        setMessage('');
        setUpdatedStory(null);
        try {
            const updatedStory = await updateStory(
                Number(storyId),
                userId,
                title,
                content,
                Number(eventId),
                images
            );
            setUpdatedStory(updatedStory);
            setMessage('스토리 업데이트 성공!');
        } catch (error) {
            setMessage('스토리 업데이트 실패!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-xl font-bold mb-4">스토리 업데이트 테스트</h1>
            <input type="number" placeholder="Story ID" className="w-full p-2 border mb-2" value={storyId} onChange={(e) => setStoryId(e.target.value)} />
            <input type="text" placeholder="User ID" className="w-full p-2 border mb-2" value={userId} onChange={(e) => setUserId(e.target.value)} />
            <input type="text" placeholder="Title" className="w-full p-2 border mb-2" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder="Content" className="w-full p-2 border mb-2" value={content} onChange={(e) => setContent(e.target.value)} />
            <input type="number" placeholder="Event ID" className="w-full p-2 border mb-2" value={eventId} onChange={(e) => setEventId(e.target.value)} />
            <input type="file" multiple className="w-full p-2 border mb-2" onChange={handleImageChange} />
            <button 
                onClick={handleSubmit} 
                disabled={loading} 
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                {loading ? '업데이트 중...' : '스토리 업데이트'}
            </button>
            {message && <p className="mt-4 text-center text-red-500">{message}</p>}
            {updatedStory && (
                <div className="mt-4 p-4 border rounded bg-gray-100">
                    <h2 className="text-lg font-bold">업데이트된 스토리</h2>
                    <p><strong>ID:</strong> {updatedStory.id}</p>
                    <p><strong>제목:</strong> {updatedStory.title}</p>
                    <p><strong>내용:</strong> {updatedStory.content}</p>
                    <p><strong>이벤트 ID:</strong> {updatedStory.eventId}</p>
                    <p><strong>업데이트 날짜:</strong> {new Date(updatedStory.updatedAt).toLocaleString()}</p>
                    <div>
                        <strong>이미지:</strong>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {updatedStory.images.map((image) => (
                                <img key={image.imageId} src={image.imageUrl} alt="story" className="w-16 h-16 object-cover rounded" />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}