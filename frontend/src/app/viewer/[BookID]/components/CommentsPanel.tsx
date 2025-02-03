"use client";

import React, { useState } from "react";
import { useViewerSettings } from "../context/ViewerSettingsContext";

/** 댓글 패널 Props */
interface CommentsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/** 댓글 패널: 하단에서 80% 슬라이드 업 */
export function CommentsPanel({ isOpen, onClose }: CommentsPanelProps) {
  const { theme } = useViewerSettings();

  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments((prev) => [...prev, newComment]);
      setNewComment("");
    }
  };

  return (
    <>
      {/* 오버레이 (배경) */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />
      {/* 패널 본체 (하단 슬라이드 업) */}
      <div
        className={`fixed bottom-0 left-0 w-full h-[80%] p-4 transition-transform duration-300 ease-in-out border-2 rounded-t-lg 
          ${
            isOpen ? "translate-y-0" : "translate-y-full"
          } 
          ${
            theme === "basic"
              ? "bg-white text-black border-gray-400"
              : theme === "gray"
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-black text-white border-gray-800"
          }`}
      >
        <h2 className="text-xl font-bold mb-4">댓글</h2>

        {/* 댓글 목록 */}
        <div className="flex-1 overflow-y-auto">
          {comments.length === 0 ? (
            <p className="text-center text-sm text-gray-500">아직 댓글이 없습니다.</p>
          ) : (
            comments.map((comment, idx) => (
              <div key={idx} className="border-b py-2">
                {comment}
              </div>
            ))
          )}
        </div>

        {/* 입력창 & 등록 버튼 */}
        <div className="mt-4 flex">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="댓글을 입력하세요..."
          />
          <button
            onClick={handleAddComment}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            등록
          </button>
        </div>
      </div>
    </>
  );
}
