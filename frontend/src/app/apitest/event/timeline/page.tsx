"use client"

import {useState} from "react"
import {getTimelineEvents, Event} from "@/lib/api/index"

export default function GetTimelinePage(){
    const [userId, setUserId] = useState<string>("");
    const [events, setEvents] = useState<Event[]>([]);

    const handleGet = async () => {
        try{
            const data = await getTimelineEvents(userId);
            setEvents(data);
        }catch(error){
            console.error("타임라인 불러오기 실패!");
        }
    }

    return(
        <div>
            <label>유저 ID : </label>
            <input value={userId} onChange={(event) => {setUserId(event.target.value)}}></input>
            <button onClick={handleGet}>타임라인 이벤트 가져오기</button>

            <ul>
                {
                    events.map((event)=>(
                        <li key={event.id}>
                            <h1>이벤트!</h1>
                            <p>이벤트 ID : {event.id}</p>
                            <p>이벤트 이름 : {event.eventName}</p>
                            <p>이벤트 날짜 : {event.occurredAt.toLocaleString()}</p>
                            <p>이벤트 디스플레이 여부 : {event.display}</p>
                            <p>이벤트 카테고리 : {event.category}</p>
                        </li>
                    ))
                }
            </ul>
            
        </div>
    )
}