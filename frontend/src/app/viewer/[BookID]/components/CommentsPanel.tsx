"use client";

import { useState, useEffect } from "react";
import { useViewerSettings } from "../context/ViewerSettingsContext";
// 전역 PanelContext를 통해 현재 열려 있는 패널의 ID와 openPanel, closePanel 함수를 가져옵니다.
import { usePanelContext } from "../context/usePanelContext";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

/*
  CommentsPanel 컴포넌트는 댓글 기능을 제공하는 패널입니다.
  이 컴포넌트는 패널의 열림 여부를 로컬 상태(isOpen)로 제어하며,
  패널이 열릴 때 전역 PanelContext에 자신의 고유 ID("comments")를 등록하여,
  페이지 이동 등의 이벤트를 막고, 동시에 한 번에 하나의 패널만 열리도록 합니다.
*/
export function CommentsPanel() {
  const { theme } = useViewerSettings();
  // 로컬 상태: 패널 열림 여부 (애니메이션 및 렌더링 제어용)
  const [isOpen, setIsOpen] = useState(false);
  // 댓글 목록과 새로운 댓글 입력 상태
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");

  // 전역 PanelContext에서 현재 열려 있는 패널의 ID와, 패널을 열거나 닫을 수 있는 함수를 가져옵니다.
  const { currentOpenPanel, openPanel, closePanel } = usePanelContext();

  // 효과: 전역 패널 상태를 감시하여, 만약 현재 열려 있는 패널의 ID가 "comments"가 아니라면 자동으로 로컬 패널을 닫습니다.
  useEffect(() => {
    if (isOpen && currentOpenPanel !== "comments") {
      setIsOpen(false);
    }
  }, [currentOpenPanel, isOpen]);

  // 패널 토글 함수: 패널을 열거나 닫을 때 전역 상태를 업데이트합니다.
  const togglePanel = () => {
    setIsOpen((prev: boolean) => {
      const newState = !prev;
      if (newState) {
        // 패널이 열리면 자신의 ID "comments"를 전역 상태에 등록합니다.
        openPanel("comments");
      } else {
        // 패널이 닫히면 전역 상태를 해제합니다.
        closePanel();
      }
      return newState;
    });
  };

  // 댓글 추가 핸들러
  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments((prev) => [...prev, newComment]);
      setNewComment("");
    }
  };

  // 테마에 따른 CSS 클래스 결정 함수
  const getThemeClasses = () => {
    switch (theme) {
      case "basic":
        return "bg-white text-black border-gray-400";
      case "gray":
        return "bg-gray-800 text-white border-gray-600";
      default:
        return "bg-black text-white border-gray-800";
    }
  };

  return (
    <>
      {/* 패널을 열기 위한 버튼 */}
      <Button variant="ghost" size="icon" onClick={togglePanel}>
        <MessageSquare className="h-5 w-5" />
      </Button>

      {/* 오버레이: 클릭하면 패널을 닫습니다. */}
      {isOpen && <div className="fixed inset-0 bg-black/40 transition-opacity" onClick={togglePanel} />}

      {/* 댓글 패널 영역 */}
      <div
        className={`fixed bottom-0 left-0 w-full h-[80%] transition-transform duration-300 ease-in-out border-2 rounded-t-lg overflow-hidden
          ${isOpen ? "translate-y-0" : "translate-y-full"}
          ${getThemeClasses()}`}
      >
        <div className="h-full flex flex-col overflow-hidden">
          <h2 className="text-xl font-bold p-4">댓글</h2>

          {/* 댓글 목록 */}
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

          {/* 댓글 입력 영역 */}
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
  );
}
