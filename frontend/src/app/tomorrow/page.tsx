"use client";
import { useEffect, useState } from "react";
import { fetchChallenges, fetchParticipatedChallenges, fetchSubscribedUserChallenges } from "@/lib/api/tomorrow";
import { Challenge, ParticipatedChallenge, SubscribedUserChallenge } from "@/app/tomorrow/types/challenge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Trophy, Users } from "lucide-react";
import { SearchBar } from "./components/SearchBar";
import MyChallenges from "./components/MyChallenges";
import FollowedChallenges from "./components/FollowedChallenges";
import ChallengeList from "./components/ChallengeList";

export default function ChallengePage() {
  const router = useRouter();

  const [myChallenges, setMyChallenges] = useState<ParticipatedChallenge[]>([]);
  const [followedChallenges, setFollowedChallenges] = useState<SubscribedUserChallenge[]>([]);
  const [allChallenges, setAllChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("fakeToken");
      if (token) {
        const userId = "fake-user-id"; // 테스트를 위한 가짜 userId (나중에 실제 로그인한 유저의 ID 사용)
        const participated: ParticipatedChallenge[] = await fetchParticipatedChallenges(userId);
        setMyChallenges(participated);

        const userChallenges: SubscribedUserChallenge[] = await fetchSubscribedUserChallenges(userId);
        setFollowedChallenges(userChallenges);
      }
      const challenges: Challenge[] = await fetchChallenges();
      setAllChallenges(challenges);
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
                const token = localStorage.getItem("fakeToken");
                if (token) {
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
          <MyChallenges challenges={myChallenges} />
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
      </main>
    </div>
  );
}
