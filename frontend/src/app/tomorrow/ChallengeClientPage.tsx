"use client";

import { useEffect, useState } from "react";
import { fetchParticipatedChallenges, fetchSubscribedUserChallenges } from "@/lib/api/tomorrow";
import { Challenge, ParticipatedChallenge, SubscribedUserChallenge } from "@/app/tomorrow/types/challenge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Trophy, Users } from 'lucide-react';
import { SearchBar } from "./components/SearchBar";
import MyChallenges from "./components/MyChallenges";
import FollowedChallenges from "./components/FollowedChallenges";
import ChallengeList from "./components/ChallengeList";
import { CarouselHeader } from "@/components/custom/CarouselHeader";
import { carouselMessages } from "@/lib/constants";
import { SkeletonCarousel } from "@/components/custom/SkeletonCarousel";

interface ChallengeClientPageProps {
  serverChallenges: Challenge[];
}

export default function ChallengeClientPage({ serverChallenges }: ChallengeClientPageProps) {
  const router = useRouter();
  const [allChallenges, setAllChallenges] = useState<Challenge[]>(serverChallenges);
  const [myChallenges, setMyChallenges] = useState<ParticipatedChallenge[]>([]);
  const [followedChallenges, setFollowedChallenges] = useState<SubscribedUserChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        let storedUserId = localStorage.getItem("userId") || "default-mock-user";
        setUserId(storedUserId);

        const [participated, userChallenges] = await Promise.all([
          fetchParticipatedChallenges(storedUserId),
          fetchSubscribedUserChallenges(storedUserId)
        ]);

        setMyChallenges(participated);
        setFollowedChallenges(userChallenges);
      } catch (error) {
        console.error("🚨 챌린지 데이터 로드 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="h-full flex flex-col flex-grow overflow-y-auto bg-white bg-opacity-50 bg-[url('/subtle-prism.svg')] md:-my-4">
      <div className="">
        <CarouselHeader messages={carouselMessages.tomorrow} />
      </div>
      
      <div className="px-4 sm:px-6 py-4">
        <SearchBar placeholder="도전을 검색하세요!" />
      </div>

      <main className="flex-grow px-4 sm:px-6 space-y-8 sm:space-y-10 pb-14">
        <section>
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="font-laundrygothicbold text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#96b23c]" />
              나의 도전 이야기
            </h2>
            <Button
              className="bg-[#96b23c] hover:bg-[#638d3e] text-white text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2 font-laundrygothicregular
"
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
          {isLoading ? <SkeletonCarousel /> : <MyChallenges userId={userId} challenges={myChallenges} />}
        </section>

        <section>
          <h2 className="font-laundrygothicbold text-xl sm:text-2xl  text-gray-800 mb-4 sm:mb-6 flex items-center">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#96b23c]" />
            구독한 사람의 도전
          </h2>
          {isLoading ? <SkeletonCarousel /> : <FollowedChallenges challenges={followedChallenges} />}
        </section>

        <section>
          <ChallengeList challenges={allChallenges} isLoading={isLoading} />
        </section>
      </main>
    </div>
  );
}