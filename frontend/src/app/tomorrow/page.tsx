// app/tomorrow/page.tsx
import { fetchChallenges } from "@/lib/api/tomorrow";
import ChallengeList from "./components/ChallengeList";
import type { Challenge } from "@/app/tomorrow/types/challenge";

// ✅ 서버 컴포넌트 (SSR)
export default async function ChallengePage() {
  let allChallenges: Challenge[] = [];

  try {
    // 초기 데이터는 'LATEST' 기준으로 서버에서 가져옴
    allChallenges = await fetchChallenges("LATEST");
  } catch (error) {
    console.error("🚨 서버에서 챌린지 fetch 실패:", error);
  }

  // 초기 데이터 전달
  return <ChallengeList initialChallenges={allChallenges} />;
}
