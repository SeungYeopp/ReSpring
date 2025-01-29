// 이벤트 관련 API를 호출하는 함수의 모음.
import axiosAPI from "./axios";

// 이벤트에 대한 인터페이스
export interface Event{
    id: number,
    eventName: string,
    occurredAt: Date,
    category: string,
    display: boolean
}

// 새로운 이벤트를 생성할 때 사용되는 인터페이스.
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

// 이벤트를 삭제한다. 이 때 이벤트 id와 유저 id를 받아서 처리한다.
export const deleteEvent = async (eventId : number, userId : string) => {
    try{
        const response = await axiosAPI.delete(`/events/${eventId}`,
            {
                headers: {
                    "X-User-Id": userId,
                    "Accept": "*/*"
                  }
            }
        )
        return response.data;
    }catch(error){
        console.error('에러 발생 : ', error);
        throw new Error("deleteEvent의 에러 발생");
    }
}