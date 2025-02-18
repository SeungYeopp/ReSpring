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

      setSuccessMessage("✅ 소중한 기억이 남겨졌습니다!");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    } catch (error) {
      console.error(error);
      setSuccessMessage("❌ 추억을 남기지 못했어요.");
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
            <div className="modal-header font-bold text-lg">그 순간을 남겨보세요.</div>
            <p className="text-gray-500 text-center text-sm mb-4">
              소중한 기억을 남길 준비가 되셨나요?
            </p>
            <div>
              <label className="font-semibold block mb-2">제목</label>
              <input
                value={eventName}
                onChange={(event) => setEventName(event.target.value)}
                placeholder="예: 첫 직장 입사, 대학 졸업"
                className="input"
              />

              <label className="font-bold">날짜</label>
              <input type="date" onChange={handleDateChange} className="input" />

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
                  onChange={(event) => setDisplay(event.target.checked)}
                  className="w-4 h-4"
                />
                <label className="font-bold">발자취를 남길까요?</label>
              </div>

              {/* 버튼 배치 */}
              <div className="flex justify-between mt-4 space-x-2">
                <Button onClick={() => setIsModalOpen(false)} className="bg-gray-100 hover:bg-gray-400 text-black flex items-center px-4 py-2 rounded-md">
                  ❎ 그냥 둘래요
                </Button>
                <Button onClick={handlePost} className="bg-lightgreen-100 hover:bg-lightgreen-100 text-black flex items-center px-4 py-2 rounded-md">
                  🌱 추억 남기기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 새로운 발자취 남기는 버튼 */}
      <div className="mt-6 text-center">
        <Button
          className="w-full text-gray-700 font-semibold text-sm bg-gray-100 hover:bg-gray-200" 
          variant="ghost"
          onClick={() => setIsModalOpen(true)}
        >
          🌿 새로운 추억을 남겨볼까요?
        </Button>
      </div>

      {successMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full flex flex-col items-center justify-center text-center animate-fadeInOut">
            <span className={`text-4xl ${successMessage.includes("✅") ? "text-green-500" : "text-red-500"}`}>
              {successMessage.includes("✅") ? "✅" : "❌"}
            </span>
            <p className="font-bold mt-2">{successMessage.replace("✅ ", "").replace("❌ ", "")}</p>
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
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 8px;
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

export default AddEvent;
