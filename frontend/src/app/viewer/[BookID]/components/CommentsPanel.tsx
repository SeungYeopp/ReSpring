"use client"

import { useState } from "react"
import { useViewerSettings } from "../context/ViewerSettingsContext"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

export function CommentsPanel() {
  const { theme } = useViewerSettings()
  const [isOpen, setIsOpen] = useState(false)
  const [comments, setComments] = useState<string[]>([])
  const [newComment, setNewComment] = useState("")

  const togglePanel = () => {
    setIsOpen((prev) => !prev)
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments((prev) => [...prev, newComment])
      setNewComment("")
    }
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={togglePanel}>
        <MessageSquare className="h-5 w-5" />
      </Button>

      {isOpen && <div className="fixed inset-0 bg-black/40 transition-opacity" onClick={togglePanel} />}

      <div
        className={`fixed bottom-0 left-0 w-full h-[80%] p-4 transition-transform duration-300 ease-in-out border-2 rounded-t-lg 
          ${isOpen ? "translate-y-0" : "translate-y-full"}
          ${
            theme === "basic"
              ? "bg-white text-black border-gray-400"
              : theme === "gray"
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-black text-white border-gray-800"
          }`}
      >
        <h2 className="text-xl font-bold mb-4">댓글</h2>

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

        <div className="mt-4 flex">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="댓글을 입력하세요..."
          />
          <Button onClick={handleAddComment} variant="default" className="ml-2">
            등록
          </Button>
        </div>
      </div>
    </>
  )
}

