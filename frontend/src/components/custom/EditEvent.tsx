"use client";

import { useState, useEffect } from "react";
import { updateEvent, deleteEvent, Event } from "@/lib/api/event";
import { Button } from "../ui/button";
import { EventCategories } from "./EventCategories";

interface EditEventProps {
  event: Event | null;
  userId: string;
  onClose: () => void;
  onEventUpdated: () => void;
  onEventDeleted: () => void;
}

const EditEvent = ({ event, userId, onClose, onEventUpdated, onEventDeleted }: EditEventProps) => {
  const [eventName, setEventName] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [display, setDisplay] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);

  useEffect(() => {
    if (event) {
      setEventName(event.eventName);
      setDate(new Date(event.occurredAt).toISOString().split("T")[0]);
      setCategory(event.category);
      setDisplay(event.display);
    }
  }, [event]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const handleUpdate = async () => {
    if (!event) return;

    try {
      await updateEvent(event.id, {
        eventName,
        occurredAt: new Date(date),
        category,
        display,
      });

      setSuccessMessage("✅ 발자취가 성공적으로 고쳐졌습니다!");
      setTimeout(() => {
        setSuccessMessage(null);
        onEventUpdated();
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Failed to update event:", error);
      setSuccessMessage("❌ 발자취 고치기에 실패했습니다.");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    try {
      await deleteEvent(event.id);
      setSuccessMessage("✅ 발자취가 지워졌습니다!");
      setTimeout(() => {
        setSuccessMessage(null);
        onEventDeleted();
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Failed to delete event:", error);
      setSuccessMessage("❌ 발자취 지우기에 실패했습니다.");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    const modalContent = document.querySelector(".modal-content");
    if (modalContent && !modalContent.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleDeleteConfirmation = () => {
    setIsConfirmingDelete(true);
  };

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  const handleConfirmDelete = () => {
    setIsConfirmingDelete(false);
    handleDelete();
  };

  if (!event) return null;

  return (
    <>
      <div className="modal-overlay" onClick={handleOverlayClick}>
        {!successMessage && !isConfirmingDelete && (
          <div className="modal-content">
            <div className="modal-header font-bold text-lg">발자취 고치기</div>
            <div>
              <label className="font-bold">제목</label>
              <input
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="예: 첫 직장 입사, 대학 졸업"
                className="input"
              />

              <label className="font-bold">날짜</label>
              <input type="date" value={date} onChange={handleDateChange} className="input" />

              <label className="font-bold">카테고리</label>
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="input">
                <option value="" disabled>
                  카테고리 선택
                </option>
                {EventCategories.map(({ eventName }) => (
                  <option key={eventName} value={eventName}>
                    {eventName}
                  </option>
                ))}
              </select>

              {/* 공개 체크박스 - 개별 줄 배치 */}
              <div className="flex items-center space-x-2 my-4">
                <input
                  type="checkbox"
                  checked={display}
                  onChange={(e) => setDisplay(e.target.checked)}
                  className="w-4 h-4"
                />
                <label className="font-bold">공개</label>
              </div>

              {/* 버튼 배치 */}
              <div className="flex justify-between mt-4 space-x-2">
                <Button onClick={onClose} className="bg-gray-100 hover:bg-gray-400 text-black flex items-center px-4 py-2 rounded-md">
                  ❌ 취소
                </Button>
                <Button onClick={handleUpdate} className="bg-lightgreen-100 hover:bg-lightgreen-100 text-black flex items-center px-4 py-2 rounded-md">
                  ✏️ 수정
                </Button>
                <Button onClick={handleDeleteConfirmation} className="bg-red-100 hover:bg-red-100 text-black flex items-center px-4 py-2 rounded-md">
                  🗑️ 삭제
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          width: 80%;
          max-width: 500px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          animation: fadeIn 0.3s ease;
        }

        .modal-header {
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .input {
          padding: 10px;
          margin-bottom: 10px;
          width: 100%;
          font-size: 16px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }

        .button-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
        }

        .message-content {
          background-color: white;
          width: 200px;
          height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          animation: fadeInOut 2s ease-in-out;
          text-align: center;
        }
      `}</style>
    </>
  );
};

export default EditEvent;
