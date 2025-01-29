"use client"

import {useState} from "react"
import {EventPostDto, updateEvent} from "@/lib/api/index"

const EventUpdateTest = () => {
    const [eventId, setEventId] = useState<number>();
    const [userId, setUserId] = useState<string>("");
    const [eventName, setEventName] = useState<string>("");
    const [date, setDate] = useState<Date | undefined>();
    const [category, setCategory] = useState<string>("");
    const [display, setDisplay] = useState<boolean>(true);
    const [result, setResult] = useState<string>("");

    const handleEvnetIdChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        const inputEventId = parseInt(event.target.value, 10);
        setEventId(inputEventId);
    }

    const handleDateChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = new Date(event.target.value); // Date로 형 변환.
        setDate(selectedDate)
    }

    const handlePatch = async () => {
        try{
            const result = await updateEvent(
                eventId ?? 0,
                {userId : userId, eventName : eventName, occurredAt : date ?? new Date(), category : category, display : display}
            )
            setResult("PATCH 결과 : " + result);
        }catch(error){
            console.log(error);
        }
    }

    return (
        <div>
            <h1>이벤트 수정하기</h1>

            <label> 이벤트 ID : </label>
            <input value={eventId} onChange={handleEvnetIdChange}></input>

            <label> User ID : </label>
            <input value={userId} onChange={(event) => {setUserId(event.target.value)}}></input>

            <label> 이벤트 이름 : </label>
            <input value={eventName} onChange={(event) => {setEventName(event.target.value)}}></input>

            <label> 날짜 : </label>
            <input type="date" onChange={handleDateChange}></input>

            <label> 카테고리 : </label>
            <input value = {category} onChange={(event) => {setCategory(event.target.value)}}></input>

            <label> 디스플레이 유 / 무 : </label>
            <input type="checkbox" onChange={(event) => {setDisplay(event.target.checked)}}></input>

            <button onClick={handlePatch}>PATCH</button>

            <h1>RESULT : {result}</h1>
        </div>
    )
}

export default EventUpdateTest