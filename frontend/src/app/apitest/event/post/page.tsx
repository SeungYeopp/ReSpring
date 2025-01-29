"use client"

import {useState} from "react"
import {EventPostDto, makeEvent} from "@/lib/api/index"

export interface e{
    userId: string,
    eventName: string,
    occurredAt: Date,
    category: string,
    display: boolean
}

const EventPostTest = () => {
    const [userId, setUserId] = useState<string>("");
    const [eventName, setEventName] = useState<string>("");
    const [date, setDate] = useState<Date | undefined>();
    const [category, setCategory] = useState<string>("");
    const [display, setDisplay] = useState<boolean>(true);
    const [result, setResult] = useState<string>("");

    const handleDateChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = new Date(event.target.value); // Date로 형 변환.
        setDate(selectedDate)
    }

    const handlePost = async () => {
        try{
            const result = await makeEvent(
                {userId : userId, eventName : eventName, occurredAt : date ?? new Date(), category : category, display : display}
            )
            setResult("POST 결과 : " + result);
        }catch(error){
            console.log(error);
        }
    }

    return (
        <div>
            <h1>이벤트 POST 추가하기</h1>
            
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

            <button onClick={handlePost}>POST</button>

            <h1>RESULT : {result}</h1>
        </div>
    )
}

export default EventPostTest