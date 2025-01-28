import axiosAPI from "./axios";

export const getAllEvents = async (userId : string) => {
    const response = await axiosAPI.get(`/events?userId=${userId}`)
    return response.data;
}
