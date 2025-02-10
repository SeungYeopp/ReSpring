// import axios from "axios";
// import { mockChatRooms, mockChatMessages, type ChatRoom, type ChatMessage } from "@/app/chat/mocks/chatData";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

// // 사용자의 채팅방 목록을 가져오는 함수 (1:1 채팅과 오픈 채팅 모두 포함)
// export const getChatRooms = async (userId: string): Promise<ChatRoom[]> => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/chat/myRooms`, {
//       params: { userId },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("채팅방 목록을 가져오는 데 실패했습니다:", error);
//     // 목데이터에서 해당 사용자가 참여한 채팅방만 필터링
//     return mockChatRooms.filter((room) => room.type === "open" || (room.participants && room.participants.includes(userId)));
//   }
// };

// // 특정 채팅방의 메시지 목록을 가져오는 함수
// export const getChatMessages = async (roomId: string): Promise<ChatMessage[]> => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/chat/messages/${roomId}`);
//     return response.data;
//   } catch (error) {
//     console.error("채팅 메시지를 가져오는 데 실패했습니다:", error);
//     return mockChatMessages[roomId] || [];
//   }
// };

// // 채팅방에 참가하는 함수
// export const joinChatRoom = async (roomId: string, userId: string) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/chat/room/join`, { roomId, userId });
//     return response.data;
//   } catch (error) {
//     console.error("채팅방 참가에 실패했습니다:", error);
//     return { success: true, message: "채팅방에 참가했습니다." };
//   }
// };

// // 채팅방을 나가는 함수
// export const leaveChatRoom = async (roomId: string, userId: string) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/chat/room/leave`, { roomId, userId });
//     return response.data;
//   } catch (error) {
//     console.error("채팅방을 나가는 데 실패했습니다:", error);
//     return { success: true, message: "채팅방에서 나갔습니다." };
//   }
// };

// // 새로운 1:1 채팅 시작하는 함수
// export const startPrivateChat = async (user1: string, user2: string): Promise<ChatRoom> => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/chat/private`, {
//       params: { user1, user2 },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("1:1 채팅 시작에 실패했습니다:", error);
//     // 🛠 수정: lastMessageTimestamp 추가
//     const newRoom: ChatRoom = {
//       id: String(mockChatRooms.length + 1),
//       name: `${user2}와의 대화`,
//       lastMessage: "새로운 대화가 시작되었습니다.",
//       type: "private",
//       participants: [user1, user2],
//       lastMessageTimestamp: new Date().toISOString(),
//     };
//     mockChatRooms.push(newRoom);
//     return newRoom;
//   }
// };

// // 새로운 오픈채팅 만드는 함수
// export const createOpenChatRoom = async (roomData: { name: string; creatorId: string }): Promise<ChatRoom> => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/chat/room`, roomData);
//     return response.data;
//   } catch (error) {
//     console.error("오픈 채팅방 생성에 실패했습니다:", error);
//     // 🛠 수정: lastMessageTimestamp 추가
//     const newRoom: ChatRoom = {
//       id: String(mockChatRooms.length + 1),
//       name: roomData.name,
//       lastMessage: "채팅방이 생성되었습니다.",
//       type: "open",
//       lastMessageTimestamp: new Date().toISOString(),
//     };
//     mockChatRooms.push(newRoom);
//     return newRoom;
//   }
// };

// // WebSocket 연결을 위한 함수 (실제 구현은 별도의 WebSocket 라이브러리 사용 필요)
// export const connectWebSocket = () => {
//   console.log("WebSocket 연결 시도");
//   // 실제 WebSocket 연결 로직 구현 필요
// };

// // 특정 채팅방 메시지 구독 함수
// export const subscribeToRoom = (roomId: string, callback: (message: ChatMessage) => void) => {
//   console.log(`채팅방 ${roomId} 구독`);
//   // 실제 구독 로직 구현 필요
// };

// // 메시지 전송 함수
// export const sendMessage = (roomId: string, message: string, userId: string) => {
//   console.log(`메시지 전송: ${message} (방 ID: ${roomId}, 사용자 ID: ${userId})`);
//   // 실제 메시지 전송 로직 구현 필요
// };
