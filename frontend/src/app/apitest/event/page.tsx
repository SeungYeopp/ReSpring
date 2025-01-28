"use client"

import { useState } from "react";
import { getAllEvents, Event } from "@/lib/api/event"; // 이벤트 리스트 호출 함수와 Event 인터페이스.

const EventList = () => {
  const [userId, setUserId] = useState<string>(""); // userID를 담는 상태.
  const [events, setEvents] = useState<Event[]>([]); // Event의 배열을 담는 상태.
  const [loading, setLoading] = useState<boolean>(false); // 현재 값을 가져오는 상태인지 저장하는 상태.
  const [error, setError] = useState<string | null>(null); // 에러 메시지를 담는 상태.
  const [inputError, setInputError] = useState<string | null>(null); // 입력 에러 메시지를 담는 상태.

  // 입력값이 바뀔 때마다 호출되는 이벤트 함수수. 유저 ID 상태를 변경한다.
  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  // 이벤트 목록을 불러오는 함수. 버튼을 누를 때 호출된다.
  const handleFetchEvents = async () => {
    if (!userId) {
      setInputError("사용자 ID를 입력해주세요."); // 사용자 ID가 안 적혀있는 경우 InputError에 메시지 값을 넣는다.
      return;
    }
    setInputError(null);

    try {
      setLoading(true); // 로딩 상태 ON.
      const eventsData = await getAllEvents(userId); // 이벤트 데이터 불러오기
      setEvents(eventsData); // 이벤트 배열 업데이트.
    } catch (error) {
      setError("이벤트 데이터를 불러오는 데 실패했습니다."); // 이벤트를 불러오는 데 실패했다는 에러 메시지를 Set.
    } finally {
      setLoading(false); // 로딩 상태 OFF.
    }
  };

  return (
    <div>
      <h1>이벤트 목록 조회</h1>

      {/* 사용자 ID 입력 폼 */}
      <div>
        <input
          type="text"
          value={userId}
          onChange={handleUserIdChange}
          placeholder="사용자 ID 입력"
        />
        <button onClick={handleFetchEvents}>이벤트 불러오기</button>
        {inputError && <p style={{ color: "red" }}>{inputError}</p>}
      </div>

      {loading && <div>로딩 중...</div>} // 로딩 창.
      {error && <div>{error}</div>} // 에러 창.

      {events.length === 0 && !loading && <p>이벤트가 없습니다.</p>}

      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <h2>{event.eventName}</h2>
            <p>카테고리: {event.category}</p>
            <p>발생일: {event.occurredAt.toLocaleString()}</p>
            <p>상태: {event.display ? "표시" : "숨김"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
