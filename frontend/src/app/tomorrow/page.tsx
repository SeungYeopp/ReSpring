// app/tomorrow/page.tsx
import { fetchChallenges } from "@/lib/api/tomorrow";
import ChallengeClientPage from "./ChallengeClientPage";
import type { Challenge } from "@/app/tomorrow/types/challenge";

// ✅ 서버 컴포넌트 (SSR 및 초기 로딩 최적화)
export default async function ChallengePage() {
  // 1. 서버에서 'LATEST' 기준으로 챌린지 데이터를 가져옴
  let allChallenges: Challenge[] = [];

  try {
    // 서버에서 최신 챌린지 가져오기 (SEO & 초기 로딩 개선)
    allChallenges = await fetchChallenges("LATEST");
  } catch (error) {
    console.error("🚨 서버에서 챌린지 fetch 실패:", error);
    // 실패 시 빈 배열로 초기화
  }

  // 2. props로 클라이언트 컴포넌트에 전달
  return <ChallengeClientPage serverChallenges={allChallenges} />;
}
