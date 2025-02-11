"use client";

import { useEffect, useState } from "react";
import { fetchParticipatedChallenges, fetchSubscribedUserChallenges } from "@/lib/api/tomorrow";
import { Challenge, ParticipatedChallenge, SubscribedUserChallenge } from "@/app/tomorrow/types/challenge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Trophy, Users } from "lucide-react";
import { SearchBar } from "./components/SearchBar";
import MyChallenges from "./components/MyChallenges";
import FollowedChallenges from "./components/FollowedChallenges";
import ChallengeList from "./components/ChallengeList";
import { CarouselHeader } from "../../components/custom/CarouselHeader";
import { carouselMessages } from "@/lib/constants";

// ✅ 서버 컴포넌트에서 넘겨온 props 타입
interface ChallengeClientPageProps {
  serverChallenges: Challenge[];
}

export default function ChallengeClientPage({ serverChallenges }: ChallengeClientPageProps) {
  const router = useRouter();

  // ✅ 서버에서 받아온 전체 챌린지(SSR), 클라이언트에서도 관리 가능
  const [allChallenges, setAllChallenges] = useState<Challenge[]>(serverChallenges);

  // ✅ 참여중인 챌린지 / 구독 챌린지
  const [myChallenges, setMyChallenges] = useState<ParticipatedChallenge[]>([]);
  const [followedChallenges, setFollowedChallenges] = useState<SubscribedUserChallenge[]>([]);

  // ✅ 로딩 / 유저 ID
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // ✅ 클라이언트에서만 필요한 로직 (localStorage 접근, userId 확인)
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // localStorage에서 userId
        let storedUserId = localStorage.getItem("userId") || "default-mock-user";
        setUserId(storedUserId);

        // userId 기반 참여중 / 구독중 챌린지 fetch
        const participated = await fetchParticipatedChallenges(storedUserId);
        setMyChallenges(participated);

        const userChallenges = await fetchSubscribedUserChallenges(storedUserId);
        setFollowedChallenges(userChallenges);

        // ✅ 참고) allChallenges는 서버에서 이미 받아옴(serverChallenges)
        // => 필요하면 클라이언트에서 갱신할 수도 있음
        // ex) setAllChallenges(fetchedAllChallenges)
      } catch (error) {
        console.error("🚨 챌린지 데이터 로드 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="h-full flex flex-col flex-grow overflow-y-auto bg-white bg-opacity-50 bg-[url('/subtle-prism.svg')]  md:-my-4">
      
      {/* 캐러셀 헤더 추가 */}
      <div className="">
        <CarouselHeader messages={carouselMessages.tomorrow} />
      </div>
      
      {/* 검색창 */}
      <div className="px-4 sm:px-6 py-4">
        <SearchBar placeholder="도전을 검색하세요!" />
      </div>

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

            {/* 모든 도전 리스트 (서버에서 받아온 데이터) */}
            <section>
              <ChallengeList challenges={allChallenges} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
