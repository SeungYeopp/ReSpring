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

  const getThemeClasses = () => {
    switch (theme) {
      case "basic":
        return "bg-white text-black border-gray-400"
      case "gray":
        return "bg-gray-800 text-white border-gray-600"
      default:
        return "bg-black text-white border-gray-800"
    }
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={togglePanel}>
        <MessageSquare className="h-5 w-5" />
      </Button>

      {isOpen && <div className="fixed inset-0 bg-black/40 transition-opacity" onClick={togglePanel} />}

      <div
        className={`fixed bottom-0 left-0 w-full h-[80%] transition-transform duration-300 ease-in-out border-2 rounded-t-lg overflow-hidden
          ${isOpen ? "translate-y-0" : "translate-y-full"}
          ${getThemeClasses()}`}
      >
        <div className="h-full flex flex-col overflow-hidden">
          <h2 className="text-xl font-bold p-4">댓글</h2>

          <div className={`flex-1 overflow-y-auto px-4 ${getThemeClasses()}`}>
            {comments.length === 0 ? (
              <p className="text-center text-sm text-gray-500">아직 댓글이 없습니다.</p>
            ) : (
              comments.map((comment, idx) => (
                <div key={idx} className={`border-b py-2 ${theme === "basic" ? "border-gray-200" : "border-gray-700"}`}>
                  {comment}
                </div>
              ))
            )}
          </div>

          <div className={`p-4 ${getThemeClasses()}`}>
            <div className="flex">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className={`flex-1 p-2 border rounded ${
                  theme === "basic" ? "bg-white text-black border-gray-300" : "bg-gray-700 text-white border-gray-600"
                }`}
                placeholder="댓글을 입력하세요..."
              />
              <Button onClick={handleAddComment} variant="default" className="ml-2">
                등록
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

