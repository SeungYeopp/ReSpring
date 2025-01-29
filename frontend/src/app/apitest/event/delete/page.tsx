"use client";

import { useState } from "react";
import { deleteEvent } from "@/lib/api"; // 기존 deleteEvent 함수 가져오기

const EventDeleteTestPage = () => {
  const [eventId, setEventId] = useState<number | "">(""); // 이벤트 ID 상태
  const [userId, setUserId] = useState<string>(""); // 유저 ID 상태
  const [result, setResult] = useState<string>(""); // 결과 상태

  const handleDelete = async () => {
    if (!eventId || !userId) {
      setResult("이벤트 ID와 사용자 ID를 입력해주세요.");
      return;
    }

    const success = await deleteEvent(Number(eventId), userId); // deleteEvent 호출

    if (success) {
      setResult(`이벤트 ${eventId} 삭제 성공!`);
    } else {
      setResult("이벤트 삭제 실패! 다시 시도해주세요.");
    }
  };

  return (
    <div>
      <h1>이벤트 삭제 테스트</h1>

      {/* 이벤트 ID 입력 */}
      <label>이벤트 ID: </label>
      <input
        type="number"
        value={eventId}
        onChange={(e) => setEventId(Number(e.target.value) || "")}
      />

      {/* 사용자 ID 입력 */}
      <label>사용자 ID: </label>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      {/* 삭제 버튼 */}
      <button onClick={handleDelete}>이벤트 삭제</button>

      {/* 결과 출력 */}
      <h2>{result}</h2>
    </div>
  );
};

export default EventDeleteTestPage;
