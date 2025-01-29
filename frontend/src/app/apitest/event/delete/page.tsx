"use client";

import { useState } from "react";
import { deleteEvent } from "@/lib/api/index";

const EventDeletePage = () => {
  const [eventId, setEventId] = useState<number | "">("");
  const [userId, setUserId] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const handleDelete = async () => {
    if (!eventId || !userId) {
      setResult("이벤트 ID와 사용자 ID를 입력해주세요.");
      return;
    }

    try {
      await deleteEvent(eventId, userId);
      setResult(`이벤트 ${eventId} 삭제 성공!`);
    } catch (error) {
      setResult(`이벤트 삭제 실패!`);
      console.error("삭제 실패:", error);
    }
  };

  return (
    <div>
      <h1>이벤트 삭제</h1>

      <label>이벤트 ID: </label>
      <input
        type="number"
        value={eventId}
        onChange={(e) => setEventId(Number(e.target.value) || "")}
      />

      <label>사용자 ID: </label>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      <button onClick={handleDelete}>이벤트 삭제</button>

      <h2>{result}</h2>
    </div>
  );
};

export default EventDeletePage;
