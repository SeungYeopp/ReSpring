// src/lib/api/tomorrow.ts
import { Challenge, ChallengeDetail, ChallengeParticipant, ParticipatedChallenge, SubscribedUser, SubscribedUserChallenge } from "@/app/tomorrow/types/challenge";

import mockChallenges from "@/app/tomorrow/mocks/ChallengeMocks";
import mockChallengeDetail from "@/app/tomorrow/mocks/ChallengeDetailMocks";
import mockParticipants from "@/app/tomorrow/mocks/ChallengeParticipantsMock";
import mockParticipatedChallenges from "@/app/tomorrow/mocks/ParticipatedChallengesMock";
import mockSubscribedUsers from "@/app/tomorrow/mocks/SubscribedUsersMock";
import mockSubscribedUserChallenges from "@/app/tomorrow/mocks/SubscribedUserChallengesMock";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
// 📌 1. 챌린지 목록 조회 (정렬 가능)
export const fetchChallenges = async (sort: string = "LATEST"): Promise<Challenge[]> => {
  try {
    const response = await fetch(`${BASE_URL}/challenges?sort=${sort}`);
    if (!response.ok) throw new Error("챌린지 목록 조회 실패");
    return await response.json();
  } catch (error) {
    console.error("챌린지 목록 조회 실패, Mock 데이터 반환:", error);
    return mockChallenges;
  }
};

// 📌 2. 챌린지 상세 조회
export const getChallengeDetail = async (challengeId: number, userId: string): Promise<ChallengeDetail> => {
  try {
    const response = await fetch(`${BASE_URL}/challenges/${challengeId}?userId=${userId}`);
    if (!response.ok) throw new Error("챌린지 상세 조회 실패");
    return await response.json();
  } catch (error) {
    console.error("챌린지 상세 조회 실패, Mock 데이터 반환:", error);
    return mockChallengeDetail;
  }
};

// 📌 3. 챌린지 참여자 조회
export const fetchChallengeParticipants = async (challengeId: number): Promise<ChallengeParticipant> => {
  try {
    const response = await fetch(`${BASE_URL}/challenges/${challengeId}/participants`);
    if (!response.ok) throw new Error("챌린지 참여자 조회 실패");
    return await response.json();
  } catch (error) {
    console.error("챌린지 참여자 조회 실패, Mock 데이터 반환:", error);
    return mockParticipants;
  }
};

// 📌 4. 내가 참여한 챌린지 조회
export const fetchParticipatedChallenges = async (userId: string): Promise<ParticipatedChallenge[]> => {
  try {
    const response = await fetch(`${BASE_URL}/challenges/participated/${userId}`);
    if (!response.ok) throw new Error("내가 참여한 챌린지 조회 실패");
    return await response.json();
  } catch (error) {
    console.error("내가 참여한 챌린지 조회 실패, Mock 데이터 반환:", error);
    return mockParticipatedChallenges;
  }
};

// 📌 5. 챌린지 참가
export const joinChallenge = async (challengeId: number, userId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/challenges/${challengeId}/join/${userId}`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("챌린지 참가 실패");
    return true;
  } catch (error) {
    console.error("챌린지 참가 실패:", error);
    return false;
  }
};

// 📌 6. 챌린지 나가기
export const leaveChallenge = async (challengeId: number, userId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/challenges/${challengeId}/leave/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("챌린지 나가기 실패");
    return true;
  } catch (error) {
    console.error("챌린지 나가기 실패:", error);
    return false;
  }
};

// 📌 7. 좋아요 토글 (좋아요 추가/취소)
export const toggleChallengeLike = async (challengeId: number, userId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/challenges/${challengeId}/like/${userId}`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("좋아요 토글 실패");
    return true;
  } catch (error) {
    console.error("좋아요 토글 실패:", error);
    return false;
  }
};

// 📌 8. 챌린지 검색 (키워드 검색)
export const searchChallenges = async (keyword: string): Promise<Challenge[]> => {
  try {
    const response = await fetch(`${BASE_URL}/challenges/search?keyword=${keyword}`);
    if (!response.ok) throw new Error("챌린지 검색 실패");
    return await response.json();
  } catch (error) {
    console.error("챌린지 검색 실패, Mock 데이터 반환:", error);
    return mockChallenges;
  }
};

// 📌 9. 챌린지 생성 (multipart/form-data 처리)
export const createChallenge = async (challengeData: FormData): Promise<ChallengeDetail> => {
  try {
    const response = await fetch(`${BASE_URL}/challenges`, {
      method: "POST",
      body: challengeData,
    });
    if (!response.ok) throw new Error("챌린지 생성 실패");
    return await response.json();
  } catch (error) {
    console.error("챌린지 생성 실패:", error);
    throw error;
  }
};

// 📌 10. 챌린지 수정 (Owner만 가능)
export const updateChallenge = async (challengeId: number, updateData: FormData): Promise<ChallengeDetail> => {
  try {
    const response = await fetch(`${BASE_URL}/challenges/${challengeId}`, {
      method: "PATCH",
      body: updateData,
    });
    if (!response.ok) throw new Error("챌린지 수정 실패");
    return await response.json();
  } catch (error) {
    console.error("챌린지 수정 실패:", error);
    throw error;
  }
};

// 📌 11. 챌린지 성공 여부 기록
export const recordChallengeSuccess = async (challengeId: number, userId: string, isSuccess: boolean): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/records/${challengeId}/users/${userId}?isSuccess=${isSuccess}`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("챌린지 성공 여부 기록 실패");
    return true;
  } catch (error) {
    console.error("챌린지 성공 여부 기록 실패:", error);
    return false;
  }
};

// 📌 12. 구독한 사용자 목록 조회
export const fetchSubscribedUsers = async (userId: string): Promise<SubscribedUser[]> => {
  try {
    const response = await fetch(`${BASE_URL}/subscriptions/${userId}/users`);
    if (!response.ok) throw new Error("구독한 사용자 목록 조회 실패");
    return await response.json();
  } catch (error) {
    console.error("구독한 사용자 목록 조회 실패, Mock 데이터 반환:", error);
    return mockSubscribedUsers;
  }
};

// 📌 13. 구독한 사용자의 챌린지 목록 조회
export const fetchSubscribedUserChallenges = async (userId: string): Promise<SubscribedUserChallenge[]> => {
  try {
    const response = await fetch(`${BASE_URL}/subscriptions/${userId}/challenges`);
    if (!response.ok) throw new Error("구독한 사용자의 챌린지 조회 실패");
    return await response.json();
  } catch (error) {
    console.error("구독한 사용자의 챌린지 조회 실패, Mock 데이터 반환:", error);
    return mockSubscribedUserChallenges;
  }
};
