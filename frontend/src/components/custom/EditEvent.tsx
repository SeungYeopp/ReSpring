"use client";

import { useState, useEffect } from "react";
import { updateEvent, deleteEvent, Event } from "@/lib/api/event";
import { Button } from "../ui/button";

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
        userId,
        eventName,
        occurredAt: new Date(date),
        category,
        display,
      });

      onEventUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to update event:", error);
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    try {
      await deleteEvent(event.id, userId);
      onEventDeleted();
      onClose();
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    const modalContent = document.querySelector(".modal-content");
    if (modalContent && !modalContent.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!event) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header font-bold">사건 수정</div>
        <div>
          <label className="font-bold">제목</label>
          <input
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="예: 첫 직장 입사, 대학 졸업"
          />

          <label className="font-bold">날짜</label>
          <input type="date" value={date} onChange={handleDateChange} />

          <label className="font-bold">카테고리</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="" disabled>
              카테고리 선택
            </option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="important">Important</option>
            <option value="vacation">Vacation</option>
          </select>

          <div className="modal-footer">
            <div className="checkbox-container">
              <label className="font-bold mr-2">발자취에 표시</label>
              <input
                type="checkbox"
                checked={display}
                onChange={(e) => setDisplay(e.target.checked)}
              />
            </div>

            <div className="button-container">
              <Button onClick={onClose}>취소</Button>
              <Button onClick={handleUpdate}>수정</Button>
              <Button onClick={handleDelete} className="delete-button">
                삭제
              </Button>
            </div>
          </div>
        </div>
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

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
        }

        .button-container {
          display: flex;
          gap: 10px;
        }

        input,
        select {
          padding: 10px;
          margin-bottom: 10px;
          width: 100%;
          font-size: 16px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }

        .delete-button {
          background-color: red;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default EditEvent;
