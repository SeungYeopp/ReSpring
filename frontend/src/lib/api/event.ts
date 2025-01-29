// 이벤트 관련 API를 호출하는 함수의 모음.
import axiosAPI from "./axios";

export interface Event{
    id: number,
    eventName: string,
    occurredAt: Date,
    category: string,
    display: boolean
}

export interface EventPostDto{
    userId: string,
    eventName: string,
    occurredAt: Date,
    category: string,
    display: boolean
}

// user ID를 기반으로 해당 유저의 모든 이벤트 목록을 반환한다.
export const getAllEvents = async (userId : string): Promise<Event[]> => {
    try{
        const response = await axiosAPI.get(`/events?userId=${userId}`)
        return response.data;
    } catch(error){
        console.error('에러 발생 : ', error);
        throw new Error("getAllEvents의 에러 발생");
    }
}

// 새로운 이벤트를 만든다. 이때 반환되는 값은 그 이벤트의 ID 값이다.
export const makeEvent = async (eventPostData : EventPostDto) => {
    try{
        const response = await axiosAPI.post(`/events`, eventPostData)
        return response.data;
    } catch(error){
        console.error('에러 발생 : ', error)
        throw new Error("makeEvent의 에러 발생");
    }
}