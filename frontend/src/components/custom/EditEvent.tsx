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
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false); // New state for confirmation modal

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

      setSuccessMessage("✅ 흔적이 성공적으로 고쳐졌습니다!");
      setTimeout(() => {
        setSuccessMessage(null);
        onEventUpdated();
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Failed to update event:", error);
      setSuccessMessage("❌ 흔적 고치기에 실패했습니다.");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    try {
      await deleteEvent(event.id, userId);
      setSuccessMessage("✅ 흔적이 지워졌습니다!");
      setTimeout(() => {
        setSuccessMessage(null);
        onEventDeleted();
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Failed to delete event:", error);
      setSuccessMessage("❌ 흔적 지우기에 실패했습니다.");
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
    setIsConfirmingDelete(true); // Show confirmation modal
  };

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false); // Hide confirmation modal
  };

  const handleConfirmDelete = () => {
    setIsConfirmingDelete(false); // Hide confirmation modal
    handleDelete(); // Proceed with deletion
  };

  if (!event) return null;

  return (
    <>
      <div className="modal-overlay" onClick={handleOverlayClick}>
        {successMessage === null && !isConfirmingDelete && (
          <div className="modal-content">
            <div className="modal-header font-bold">흔적 고치기</div>
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
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="" disabled>
                  카테고리 선택
                </option>
                {EventCategories.map(({ eventName }) => (
                  <option key={eventName} value={eventName}>
                    {eventName}
                  </option>
                ))}
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
                  <Button onClick={handleUpdate}>고치기</Button>
                  <Button onClick={handleDeleteConfirmation} className="delete-button">
                    지우기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isConfirmingDelete && (
          <div className="confirmation-modal">
            <div className="modal-content">
              <div className="modal-header">정말로 이 흔적을 지우시겠습니까?</div>
              <div className="button-container">
                <Button onClick={handleCancelDelete}>취소</Button>
                <Button onClick={handleConfirmDelete} className="delete-button">
                  지우기
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {successMessage && (
        <div className="message-overlay">
          <div className="message-content">
            {successMessage.includes("✅") ? (
              <span className="icon success">✅</span>
            ) : (
              <span className="icon error">❌</span>
            )}
            <p className="message-text">{successMessage.replace("✅ ", "").replace("❌ ", "")}</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay,
        .message-overlay,
        .confirmation-modal {
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
          justify-content: center;
          align-items: center;
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

        .icon {
          font-size: 50px;
          margin-bottom: 8px;
        }

        .message-text {
          font-size: 16px;
          color: black;
          font-weight: bold;
        }

        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
    </>
  );
};

export default EditEvent;
