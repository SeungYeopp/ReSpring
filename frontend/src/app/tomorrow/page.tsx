// app/tomorrow/page.tsx
import { fetchChallenges } from "@/lib/api/tomorrow";
import ChallengeClientPage from "./ChallengeClientPage";
import type { Challenge } from "@/app/tomorrow/types/challenge";

// ✅ 서버 컴포넌트 (기본)
export default async function ChallengePage() {
  // 1. 서버에서 미리 데이터를 가져옴 (SSR 가능)
  let allChallenges: Challenge[] = [];

  try {
    // 서버에서 모든 챌린지 가져오기
    // (백엔드가 동작중이면 SSR로 실제 요청 → SEO & 초기 로딩 개선)
    allChallenges = await fetchChallenges();
  } catch (error) {
    console.error("🚨 서버에서 allChallenges fetch 실패:", error);
    // 실패 시 빈 배열 등 처리
  }

  // 2. props로 클라이언트 컴포넌트에 전달
  return <ChallengeClientPage serverChallenges={allChallenges} />;
}
