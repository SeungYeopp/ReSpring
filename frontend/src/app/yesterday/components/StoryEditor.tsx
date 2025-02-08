"use client";

interface StoryEditorProps {
  title: string;
  content: string;
  onTitleChange: (newTitle: string) => void;
  onContentChange: (newContent: string) => void;
}

export default function StoryEditor({ title, content, onTitleChange, onContentChange }: StoryEditorProps) {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTitleChange(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
  };

  return (
    <div className="w-full p-6 space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
          제목
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="제목을 작성해주세요"
          className="w-full p-2 mt-2 border rounded-md"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-semibold text-gray-700">
          내용
        </label>
        <textarea
          id="content"
          value={content}
          onChange={handleContentChange}
          placeholder="내용을 작성해주세요"
          rows={6}
          className="w-full p-2 mt-2 border rounded-md"
        />
      </div>
    </div>
  );
}