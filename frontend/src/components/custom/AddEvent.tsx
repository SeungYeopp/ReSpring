"use client";

import { useState } from "react";
import { makeEvent } from "@/lib/api/index";
import { Button } from "../ui/button";
import { EventCategories } from "./EventCategories";

export interface Event {
  userId: string;
  eventName: string;
  occurredAt: Date;
  category: string;
  display: boolean;
}

interface AddEventProps {
  onEventAdded: () => void;
}

const AddEvent = ({ onEventAdded }: AddEventProps) => {
  const [userId, setUserId] = useState<string>("beb9ebc2-9d32-4039-8679-5d44393b7252");
  const [eventName, setEventName] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>();
  const [category, setCategory] = useState<string>("");
  const [display, setDisplay] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    setDate(selectedDate);
  };

  const handlePost = async () => {
    try {
      await makeEvent({
        eventName,
        occurredAt: date ?? new Date(),
        category,
        display,
      });

      setIsModalOpen(false);
      onEventAdded();

      setSuccessMessage("✅ 흔적을 성공적으로 남기셨습니다!");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    } catch (error) {
      console.error(error);
      setSuccessMessage("❌ 흔적을 남기는데 실패했습니다.");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    const modalContent = document.querySelector(".modal-content");
    if (modalContent && !modalContent.contains(e.target as Node)) {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content">
            <div className="modal-header font-bold">흔적 남기기</div>
            <div>
              <label className="font-bold">제목</label>
              <input
                value={eventName}
                onChange={(event) => setEventName(event.target.value)}
                placeholder="예: 첫 직장 입사, 대학 졸업"
              />
              <label className="font-bold">날짜</label>
              <input type="date" onChange={handleDateChange} />
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
                    onChange={(event) => setDisplay(event.target.checked)}
                  />
                </div>

                <div className="button-container">
                  <Button onClick={() => setIsModalOpen(false)}>취소</Button>
                  <Button onClick={handlePost}>남기기</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Button onClick={() => setIsModalOpen(true)}>+ 새로운 흔적 남기기</Button>

      {successMessage && (
        <div className="message-overlay">
          <div className="message-content">
            {successMessage.includes("✅") ? (
              <span className="icon success">✅</span>
            ) : (
              <span className="icon error">❌</span>
            )}
            <p className="message-text w-[80%]">{successMessage.replace("✅ ", "").replace("❌ ", "")}</p>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Modal Overlay */
        .modal-overlay, .message-overlay {
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

        /* Modal Content */
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
        }

        /* Input Fields */
        input,
        select {
          padding: 10px;
          margin-bottom: 10px;
          width: 100%;
          font-size: 16px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }

        /* Success / Error Message */
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

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
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

export default AddEvent;
