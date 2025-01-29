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
// 입력 : user ID (String)
// 출력 : Event 배열 (Event[])
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
// 입력 : 이벤트 POST 관련 데이터 (EventPostDto)
// 출력 : 새로 만들어진 이벤트의 ID (number)
export const makeEvent = async (eventPostData : EventPostDto) : Promise<number>=> {
    try{
        const response = await axiosAPI.post(`/events`, eventPostData)
        return response.data; // 새로 만들어진 이벤트의 ID가 반환된다.
    } catch(error){
        console.error('에러 발생 : ', error)
        throw new Error("makeEvent의 에러 발생");
    }
}

// 이벤트를 삭제한다. 이 때 이벤트 id와 유저 id를 받아서 처리한다.
// 입력 : 이벤트 ID(number), 유저 ID(string)
// 출력 : 삭제가 제대로 되었는지 여부 boolean
export const deleteEvent = async (eventId : number, userId : string) : Promise<boolean> => {
    try{
        const response = await axiosAPI.delete(`/events/${eventId}`,
            {
                headers: {
                    "X-User-Id": userId,
                    "Accept": "*/*" // 서버로부터 아무 타입의 반환값을 받겠다는 것을 의미한데요.
                }
            }
        )

        if(response.status === 200){
            return true; // 성공 시 true 반환.
        }else{
            console.log("deleteEvent : response status 200이 아님. 에러 발생.");
            return false;
        }
    }catch(error){
        console.error('에러 발생 : ', error);
        return false;
    }
}

// 이벤트를 업데이트 하는 함수. 이벤트 ID와 이벤트 POST DTO를 모두 받는다.
// 입력 : 이벤트 ID(number), 이벤트 POST 관련 데이터 (EventPostDto)
// 출력 : 업데이트가 제대로 되었는지 여부 boolean
export const updateEvent = async (eventId : number, eventPostData : EventPostDto) : Promise<boolean> => {
    try{
        const response = await axiosAPI.patch(`/events/${eventId}`, eventPostData);

        if(response.status === 200){
            return true;
        }else{
            console.log("updateEvent : response status 200이 아님. 에러 발생.");
            return false;
        }
    }catch(error){
        console.error('에러 발생 : ', error);
        return false;
    }
}

// 어떤 사용자의 타임라인 내 이벤트 목록을 불러옵니다.
// 입력 : 유저 ID(string)
// 출력 : 타임라인 내 이벤트 배열(Event[])
export const getTimelineEvents = async (userId : string) : Promise<Event[]> => {
    try{
        const response = await axiosAPI.get(`/events/timeline/${userId}`);
        return response.data;
    }catch(error){
        console.error('getTimeline 에러 발생', error);
        throw new Error("getTimeline 에러 발생");
    }
}