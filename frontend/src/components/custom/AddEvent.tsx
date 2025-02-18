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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={handleOverlayClick}>
          <div className="modal-content bg-white p-6 rounded-lg shadow-xl max-w-lg w-full animate-fadeIn">
            <div className="text-center font-bold text-xl mb-4">흔적 남기기</div>
            <div>
              <label className="font-semibold block mb-2">제목</label>
              <input
                value={eventName}
                onChange={(event) => setEventName(event.target.value)}
                placeholder="예: 첫 직장 입사, 대학 졸업"
                className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <label className="font-semibold block mb-2">날짜</label>
              <input
                type="date"
                onChange={handleDateChange}
                className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <label className="font-semibold block mb-2">카테고리</label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="" disabled>카테고리 선택</option>
                {EventCategories.map(({ eventName }) => (
                  <option key={eventName} value={eventName}>
                    {eventName}
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <label className="font-semibold mr-2">발자취에 표시</label>
                  <input
                    type="checkbox"
                    checked={display}
                    onChange={(event) => setDisplay(event.target.checked)}
                    className="h-5 w-5"
                  />
                </div>

                <div className="flex gap-4">
                  <Button onClick={() => setIsModalOpen(false)} variant="secondary" className="bg-white text-brand border border-brand hover:bg-brand-light">취소</Button>
                  <Button onClick={handlePost} className="bg-brand text-white hover:bg-brand-dark">남기기</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Button onClick={() => setIsModalOpen(true)} className="mx-auto block mt-10 bg-brand text-white hover:bg-brand-dark">+ 새로운 흔적 남기기</Button>

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
