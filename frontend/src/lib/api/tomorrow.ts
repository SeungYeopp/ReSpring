// src/lib/api/tomorrow.ts
import { Challenge, ChallengeCreateRequest, ChallengeDetail, ChallengeParticipant, ChallengeUpdateRequest, ParticipatedChallenge, SubscribedUser, SubscribedUserChallenge } from "@/app/tomorrow/types/challenge";

import mockChallenges from "@/app/tomorrow/mocks/ChallengeMocks";
import mockChallengeDetail from "@/app/tomorrow/mocks/ChallengeDetailMocks";
import mockParticipants from "@/app/tomorrow/mocks/ChallengeParticipantsMock";
import mockParticipatedChallenges from "@/app/tomorrow/mocks/ParticipatedChallengesMock";
import mockSubscribedUserChallenges from "@/app/tomorrow/mocks/SubscribedUserChallengesMock";
import mockSubscribedUsers from "@/app/tomorrow/mocks/SubscribedUsersMock";
import type {SortOption } from "@/app/tomorrow/types/challenge";
import axiosAPI from "./axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

/**
 * 📌 1. 챌린지 목록 조회 (정렬 가능)
 */
export const fetchChallenges = async (
  sort: SortOption = "LATEST"
): Promise<Challenge[]> => {
  try {
    const response = await fetch(`${BASE_URL}/challenges?sort=${sort}`);
    if (!response.ok) throw new Error("챌린지 목록 조회 실패");
    return await response.json();
  } catch (error) {
    console.error("챌린지 목록 조회 실패, Mock 데이터 반환:", error);
    return mockChallenges;  // 실패 시 빈 배열 대신 목데이터 반환
  }
};


/**
 * 📌 2. 챌린지 상세 조회
 */
export const getChallengeDetail = async (challengeId: number, userId: string): Promise<ChallengeDetail> => {
  try {
    const response = await fetch(`${BASE_URL}/challenges/${challengeId}?userId=${userId}`);
    if (!response.ok) throw new Error("챌린지 상세 조회 실패");
    return await response.json(); // 이 부분은 API가 단일 객체를 반환하는지 확인 필요
  } catch (error) {
    console.error("챌린지 상세 조회 실패, Mock 데이터 반환:", error);
    return mockChallengeDetail[0]; // mock 데이터가 배열이라면 첫 번째 요소 반환
  }
};

/**
 * 📌 3. 챌린지 상태별 조회 (UPCOMING, ONGOING, COMPLETED)
 */
export const fetchChallengesByStatus = async (status: "UPCOMING" | "ONGOING" | "COMPLETED"): Promise<Challenge[]> => {
  try {
    const response = await fetch(`${BASE_URL}/challenges/status?status=${status}`);
    if (!response.ok) throw new Error(`챌린지 상태별 조회(${status}) 실패`);
    return await response.json();
  } catch (error) {
    console.error(`챌린지 상태별 조회(${status}) 실패, Mock 데이터 반환:`, error);
    return mockChallenges;
  }
};

/**
 * 📌 4. 내가 참여한 챌린지 조회 (API 호출 실패 시 Mock 데이터 반환)
 */
export const fetchParticipatedChallenges = async (userId: string): Promise<ParticipatedChallenge[]> => {
  try {
    const url = `${BASE_URL}/challenges/participated/${userId}`;
    console.log("🟢 API 요청 URL:", url);

    const response = await fetch(url);

    console.log("🟢 API 응답 상태 코드:", response.status);
    console.log("🟢 API 응답 헤더:", response.headers);

    if (!response.ok) {
      console.warn("⚠️ API 응답 실패:", response.status, response.statusText);
      throw new Error(`API 응답 실패: ${response.status} ${response.statusText}`);
    }

    try {
      const data = await response.json();
      console.log("🟢 API 응답 데이터:", data);
      return data;
    } catch (jsonError) {
      console.error("🚨 JSON 변환 실패 (응답이 JSON이 아닐 가능성 있음):", jsonError);
      throw new Error("API 응답을 JSON으로 변환하는데 실패했습니다.");
    }
  } catch (error) {
    console.error("🚨 API 호출 실패! 네트워크 문제이거나 서버 오류일 가능성 있음.");
    console.error("🚨 에러 메시지:", (error as Error).message);
    console.warn("⚠️ Mock 데이터 반환:", mockParticipatedChallenges);
    return mockParticipatedChallenges;
  }
};

/**
 * 📌 5. 챌린지 참가
 */
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

/**
 * 📌 6. 챌린지 나가기
 */
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

/**
 * 📌 7. 좋아요 토글 (좋아요 추가/취소)
 */
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

/**
 * 📌 8. 챌린지 검색 (키워드 검색)
 */
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

/**
 * 📌 9. 챌린지 생성 (multipart/form-data 처리)
 */
export const createChallenge = async (challengeData: ChallengeCreateRequest): Promise<ChallengeDetail> => {
  try {
    const formData = new FormData();
    
    const challengeDto = {
      title: challengeData.title,
      description: challengeData.description,
      startDate: challengeData.startDate,
      endDate: challengeData.endDate,
      tags: challengeData.tags,
      ownerId: challengeData.ownerId,
    };

    formData.append("challengeDto", JSON.stringify(challengeDto));

    if (challengeData.image) {
      formData.append("image", challengeData.image);
    }
    const response = await axiosAPI.post(`${BASE_URL}/challenges`, formData, {headers : {'Content-Type': 'multipart/form-data'}});

    console.log("🔍 서버 응답 상태 코드:", response.status);
    return response.data;
    
    }catch(error){
      console.error("❌ 챌린지 생성 실패");
      throw new Error("챌린지 생성 실패");
    }
};

/**
 * 📌 10. 챌린지 수정 (Owner만 가능)
 */
export const updateChallenge = async (challengeId: number, updateData: ChallengeUpdateRequest): Promise<ChallengeDetail> => {
  try {
    const formData = new FormData();
    const updateDto: any = {};
    if (updateData.description) {
      updateDto.description = updateData.description;
    }
    if (updateData.endDate) {
      updateDto.endDate = updateData.endDate;
    }
    updateDto.ownerId = updateData.ownerId;
    formData.append("updateDto", JSON.stringify(updateDto));
    if (updateData.image) {
      formData.append("image", updateData.image);
    }
    const response = await fetch(`${BASE_URL}/challenges/${challengeId}`, {
      method: "PATCH",
      body: formData,
    });
    if (!response.ok) throw new Error("챌린지 수정 실패");
    return await response.json();
  } catch (error) {
    console.error("챌린지 수정 실패:", error);
    throw error;
  }
};

/**
 * 📌 11. 챌린지 성공 여부 기록
 */
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

/**
 * 📌 12. 챌린지 참여자 조회
 */
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

/**
 * 📌 13. 구독한 사용자의 챌린지 목록 조회
 */
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

/**
 * 📌 14. 내가 구독한 사용자 목록 조회
 */
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
