// src/lib/api/tomorrow.ts
import {
  Challenge,
  ChallengeCreateRequest,
  ChallengeDetail,
  ChallengeParticipant,
  ChallengeUpdateRequest,
  ParticipatedChallenge,
  SubscribedUser,
  SubscribedUserChallenge,
} from "@/app/tomorrow/types/challenge";

import type { SortOption } from "@/app/tomorrow/types/challenge";
import axiosAPI from "./axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

/**
 * 📌 1. 챌린지 목록 조회 (정렬 가능)
 */
export const fetchChallenges = async (
  sort: SortOption = "LATEST"
): Promise<Challenge[]> => {
  try {
    const response = await axiosAPI.get(`${BASE_URL}/challenges?sort=${sort}`);
    return response.data;
  } catch (error) {
    console.error("챌린지 목록 조회 실패:", error);
    throw new Error("챌린지 목록 조회 실패");
  }
};

/**
 * 📌 2. 챌린지 상세 조회
 */
export const getChallengeDetail = async (
  challengeId: number
): Promise<ChallengeDetail> => {
  try {
    const response = await axiosAPI.get(
      `${BASE_URL}/challenges/${challengeId}`
    );
    return response.data;
  } catch (error) {
    console.error("챌린지 상세 조회 실패:", error);
    throw new Error("챌린지 상세 조회 실패");
  }
};

/**
 * 📌 3. 챌린지 상태별 조회 (UPCOMING, ONGOING, COMPLETED)
 */
export const fetchChallengesByStatus = async (
  status: "UPCOMING" | "ONGOING" | "COMPLETED"
): Promise<Challenge[]> => {
  try {
    const response = await axiosAPI.get(
      `${BASE_URL}/challenges/status?status=${status}`
    );
    return response.data;
  } catch (error) {
    console.error(`챌린지 상태별 조회(${status}) 실패:`, error);
    throw new Error(`챌린지 상태별 조회(${status}) 실패`);
  }
};

/**
 * 📌 4. 내가 참여한 챌린지 조회
 */
export const fetchParticipatedChallenges = async (): Promise<
  ParticipatedChallenge[]
> => {
  try {
    const response = await axiosAPI.get(`${BASE_URL}/challenges/participated`);
    return response.data;
  } catch (error) {
    console.error("🚨 내가 참여한 챌린지 조회 실패:", error);
    throw new Error("내가 참여한 챌린지 조회 실패");
  }
};

/**
 * 📌 5. 챌린지 참가
 */
export const joinChallenge = async (challengeId: number): Promise<boolean> => {
  try {
    await axiosAPI.post(`${BASE_URL}/challenges/${challengeId}/join`);
    return true;
  } catch (error) {
    console.error("챌린지 참가 실패:", error);
    return false;
  }
};

/**
 * 📌 6. 챌린지 나가기
 */
export const leaveChallenge = async (challengeId: number): Promise<boolean> => {
  try {
    await axiosAPI.delete(`${BASE_URL}/challenges/${challengeId}/leave`);
    return true;
  } catch (error) {
    console.error("챌린지 나가기 실패:", error);
    return false;
  }
};

/**
 * 📌 7. 좋아요 토글
 */
export const toggleChallengeLike = async (
  challengeId: number
): Promise<boolean> => {
  try {
    await axiosAPI.post(`${BASE_URL}/challenges/${challengeId}/like`);
    return true;
  } catch (error) {
    console.error("좋아요 토글 실패:", error);
    return false;
  }
};

/**
 * 📌 8. 챌린지 검색
 */
export const searchChallenges = async (
  keyword: string
): Promise<Challenge[]> => {
  try {
    const response = await axiosAPI.get(
      `${BASE_URL}/challenges/search?keyword=${keyword}`
    );
    return response.data;
  } catch (error) {
    console.error("챌린지 검색 실패:", error);
    throw new Error("챌린지 검색 실패");
  }
};

/**
 * 📌 9. 챌린지 생성
 */
export const createChallenge = async (
  challengeData: ChallengeCreateRequest
): Promise<ChallengeDetail> => {
  try {
    const formData = new FormData();
    formData.append(
      "challengeDto",
      new Blob([JSON.stringify(challengeData)], { type: "application/json" })
    );
    if (challengeData.image) formData.append("image", challengeData.image);

    const response = await axiosAPI.post(`${BASE_URL}/challenges`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("챌린지 생성 실패:", error);
    throw new Error("챌린지 생성 실패");
  }
};

/**
 * 📌 10. 챌린지 수정
 */
export const updateChallenge = async (
  challengeId: number,
  updateData: ChallengeUpdateRequest
): Promise<ChallengeDetail> => {
  try {
    const formData = new FormData();
    formData.append(
      "updateDto",
      new Blob([JSON.stringify(updateData)], { type: "application/json" })
    );
    if (updateData.image) formData.append("image", updateData.image);

    const response = await axiosAPI.patch(
      `${BASE_URL}/challenges/${challengeId}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("챌린지 수정 실패:", error);
    throw new Error("챌린지 수정 실패");
  }
};

/**
 * 📌 11. 챌린지 성공 여부 기록
 */
export const recordChallengeSuccess = async (
  challengeId: number,
  isSuccess: boolean
): Promise<boolean> => {
  try {
    await axiosAPI.post(`${BASE_URL}/records/${challengeId}?isSuccess=${isSuccess}`, {
      isSuccess,
    });
    return true;
  } catch (error) {
    console.error("챌린지 성공 여부 기록 실패:", error);
    return false;
  }
};

/**
 * 📌 12. 챌린지 참여자 조회
 */
export const fetchChallengeParticipants = async (
  challengeId: number
): Promise<ChallengeParticipant> => {
  try {
    const response = await axiosAPI.get(
      `${BASE_URL}/challenges/${challengeId}/participants`
    );
    return response.data;
  } catch (error) {
    console.error("챌린지 참여자 조회 실패:", error);
    throw new Error("챌린지 참여자 조회 실패");
  }
};

/**
 * 📌 13. 구독한 사용자의 챌린지 목록 조회
 */
export const fetchSubscribedUserChallenges = async (): Promise<
  SubscribedUserChallenge[]
> => {
  try {
    const response = await axiosAPI.get(
      `${BASE_URL}/subscriptions/me/challenges`
    );
    return response.data;
  } catch (error) {
    console.error("구독한 사용자의 챌린지 조회 실패:", error);
    throw new Error("구독한 사용자의 챌린지 조회 실패");
  }
};

/**
 * 📌 14. 내가 구독한 사용자 목록 조회
 */
export const fetchSubscribedUsers = async (): Promise<SubscribedUser[]> => {
  try {
    const response = await axiosAPI.get(`${BASE_URL}/subscriptions/me/users`);
    return response.data;
  } catch (error) {
    console.error("구독한 사용자 목록 조회 실패:", error);
    throw new Error("구독한 사용자 목록 조회 실패");
  }
};

/**
 * 📌 15. 챌린지 참여 여부 반환
 */
export const checkParticipationStatus = async (challengeId: number): Promise<boolean> => {
  try {
    const participatedChallenges = await fetchParticipatedChallenges();
    return participatedChallenges.some((challenge) => challenge.id === challengeId);
  } catch (error) {
    console.error("챌린지 참가 여부 확인 실패:", error);
    return false; // Default to false if fetching fails
  }
};