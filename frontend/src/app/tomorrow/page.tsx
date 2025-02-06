"use client";
import { useEffect, useState } from "react";
import {
  fetchChallenges,
  fetchParticipatedChallenges,
  fetchSubscribedUserChallenges,
} from "@/lib/api/tomorrow";
import {
  Challenge,
  ParticipatedChallenge,
  SubscribedUserChallenge,
} from "@/app/tomorrow/types/challenge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Trophy, Users } from "lucide-react";
import { SearchBar } from "./components/SearchBar";
import MyChallenges from "./components/MyChallenges";
import FollowedChallenges from "./components/FollowedChallenges";
import ChallengeList from "./components/ChallengeList";
// import { getSessionInfo } from "@/lib/api/user"; // ✅ 나중에 활성화할 부분 (현재는 localStorage 방식 유지)

export default function ChallengePage() {
  const router = useRouter();

  const [myChallenges, setMyChallenges] = useState<ParticipatedChallenge[]>([]);
  const [followedChallenges, setFollowedChallenges] = useState<SubscribedUserChallenge[]>([]);
  const [allChallenges, setAllChallenges] = useState<Challenge[]>([]);

  const [isLoading, setIsLoading] = useState(true); // ✅ 로딩 상태 추가
  const [userId, setUserId] = useState<string | null>(null); // ✅ 실제 로그인된 유저 ID 저장

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        // ✅ 현재 로그인한 사용자 ID 가져오기 (localStorage 방식 유지)
        const token = localStorage.getItem("fakeToken");
        let storedUserId = localStorage.getItem("userId") || "default-mock-user";
        console.log("🟢 userId 확인:", storedUserId);
        
        setUserId(storedUserId);
        console.log("✅ setUserId 호출됨, 현재 userId:", storedUserId);

        // 🔽 나중에 `getSessionInfo`를 사용하고 싶다면, 아래 주석을 해제 후 적용 가능 🔽
        // try {
        //   const session = await getSessionInfo();
        //   console.log("✅ 세션 정보:", session);
        //   setUserId(session.userId); // ✅ 세션에서 가져온 userId 적용
        //   storedUserId = session.userId; // ✅ 이후 API 호출에서 사용
        // } catch (error) {
        //   console.error("🚨 세션 정보 가져오기 실패:", error);
        // }

        // ❗ userId가 없어도 API 요청 진행하고, 실패하면 Mock 데이터 사용!
        console.log("🟢 fetchParticipatedChallenges 호출됨, userId:", storedUserId);
        const participated = await fetchParticipatedChallenges(storedUserId);
        console.log("✅ 내가 참여한 챌린지:", participated);
        setMyChallenges(participated);
        console.log("✅ setMyChallenges 호출 완료!");

        const userChallenges = await fetchSubscribedUserChallenges(storedUserId);
        console.log("✅ 구독한 사람의 챌린지:", userChallenges);
        setFollowedChallenges(userChallenges);

        const challenges = await fetchChallenges();
        console.log("✅ 전체 챌린지 목록:", challenges);
        setAllChallenges(challenges);
      } catch (error) {
        console.error("🚨 챌린지 데이터 로드 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);


  return (
    <div className="h-full flex flex-col flex-grow overflow-y-auto bg-white bg-opacity-50 bg-[url('/subtle-prism.svg')]">
      {/* 검색창 */}
      <div className="px-4 sm:px-6 py-4">
        <SearchBar placeholder="도전을 검색하세요!" />
      </div>

      {/* 메인 컨텐츠 */}
      <main className="flex-grow px-4 sm:px-6 space-y-8 sm:space-y-10 pb-14">
        {isLoading ? (
          <div className="text-center text-gray-500 py-10">로딩 중...</div>
        ) : (
          <>
            {/* 나의 도전 */}
            <section>
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#96b23c]" />
                  나의 도전 이야기
                </h2>
                <Button
                  className="bg-[#96b23c] hover:bg-[#638d3e] text-white font-semibold text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2"
                  onClick={() => {
                    if (userId) {
                      router.push("/tomorrow/create");
                    } else {
                      toast({
                        title: "로그인이 필요합니다",
                        description: "새로운 도전을 생성하려면 먼저 로그인해주세요.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  새로운 도전
                </Button>
              </div>
              <MyChallenges userId={userId} challenges={myChallenges} />
              </section>

            {/* 팔로우한 사람의 도전 */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#96b23c]" />
                구독한 사람의 도전
              </h2>
              <FollowedChallenges challenges={followedChallenges} />
            </section>

            {/* 모든 도전 리스트 */}
            <section>
              <ChallengeList challenges={allChallenges} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
