// 이벤트 관련 API를 호출하는 함수의 모음.
import axiosAPI from "./axios";

export interface Event{
    id: number,
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
