"use client";

import { useState } from "react";
import { makeEvent } from "@/lib/api/index";
import { Button } from "../ui/button";

export interface Event {
  userId: string;
  eventName: string;
  occurredAt: Date;
  category: string;
  display: boolean;
}

const AddEvent = () => {
  const [userId, setUserId] = useState<string>("8804cbcb-df88-11ef-a027-8cb0e9dbb9cd");
  const [eventName, setEventName] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>();
  const [category, setCategory] = useState<string>("");
  const [display, setDisplay] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    setDate(selectedDate);
  }

  const handlePost = async () => {
    try {
      await makeEvent({
        userId,
        eventName,
        occurredAt: date ?? new Date(),
        category,
        display
      });
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    const modalContent = document.querySelector('.modal-content');
    if (modalContent && !modalContent.contains(e.target as Node)) {
      setIsModalOpen(false);
    }
  }

  return (
    <>
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content">
            <div className="modal-header font-bold">사건 추가</div>
            <div>
              <label className="font-bold">제목</label>
              <input
                value={eventName}
                onChange={(event) => { setEventName(event.target.value) }}
                placeholder="예: 첫 직장 입사, 대학 졸업"
              />
              <label className="font-bold">날짜</label>
              <input type="date" onChange={handleDateChange} />
              <label className="font-bold">카테고리</label>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="" disabled selected>카테고리 선택</option>
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
                    onChange={(event) => { setDisplay(event.target.checked) }}
                  />
                </div>

                <div className="button-container">
                  <Button onClick={() => setIsModalOpen(false)}>취소</Button>
                  <Button onClick={handlePost}>추가</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Button onClick={() => setIsModalOpen(true)}>
        + 새로운 사건 추가하기
      </Button>

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

        input[type="checkbox"] {
          width: auto;
          margin-right: 10px;
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

        input[type="checkbox"] {
          width: auto;
          margin-right: 10px;
        }
      `}</style>
    </>
  );
}

export default AddEvent;