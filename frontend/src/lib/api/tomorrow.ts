import type { Challenge, ChallengesResponse, UserChallengesResponse, ChallengeDetailResponse } from "../../app/tomorrow/types/challenge";
import { mockChallenges, mockUserChallenges } from "../../app/tomorrow/mocks/ChallengeMocks";

interface ApiError {
  error: string;
  message: string;
}

export async function fetchChallenges(page = 1, size = 10, query = ""): Promise<ChallengesResponse> {
  try {
    const url = new URL("/api/challenges", window.location.origin);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("size", size.toString());
    if (query) {
      url.searchParams.append("query", query);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      if (response.status === 400) {
        throw new Error(errorData.message || "잘못된 요청입니다.");
      }
      throw new Error(errorData.message || "서버 오류가 발생했습니다.");
    }

    const data: ChallengesResponse = await response.json();

    // 각 챌린지에 대해 세부 정보를 가져옵니다.
    const challengesWithDetails = await Promise.all(
      data.data.map(async (challenge: Challenge) => {
        const detailData = await fetchChallengeDetail(challenge.challenge_id.toString());
        return { ...challenge, ...detailData.data };
      })
    );

    return {
      ...data,
      data: challengesWithDetails,
    };
  } catch (error) {
    console.error("Failed to fetch challenges:", error);
    // Fallback to mock data
    return {
      status: "success",
      data: mockChallenges.slice((page - 1) * size, page * size),
      pagination: {
        current_page: page,
        page_size: size,
        total_pages: Math.ceil(mockChallenges.length / size),
        total_items: mockChallenges.length,
      },
    };
  }
}

export async function fetchUserChallenges(): Promise<UserChallengesResponse> {
  try {
    const response = await fetch("/api/user/challenges", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();

      if (response.status === 401) {
        throw new Error("로그인이 필요하거나 세션이 만료되었습니다.");
      }
      throw new Error(errorData.message || "서버 오류가 발생했습니다.");
    }

    const data: UserChallengesResponse = await response.json();

    if (Array.isArray(data.data) && data.data.length === 0) {
      return {
        status: "success",
        data: [],
      };
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch user challenges:", error);

    if (error instanceof Error && error.message === "로그인이 필요하거나 세션이 만료되었습니다.") {
      throw error;
    }

    return {
      status: "success",
      data: mockUserChallenges,
    };
  }
}

export async function fetchChallengeDetail(challengeId: number | string): Promise<ChallengeDetailResponse> {
  try {
    const response = await fetch(`/api/challenges/${challengeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      if (response.status === 404) {
        throw new Error("해당 ID의 챌린지를 찾을 수 없습니다.");
      }
      throw new Error(errorData.message || "서버 오류가 발생했습니다.");
    }

    const data: ChallengeDetailResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch challenge detail:", error);
    throw error;
  }
}
