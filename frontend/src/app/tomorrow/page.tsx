"use client";
import { SearchBar } from "./components/SearchBar";
import MyChallenges from "./components/MyChallenges";
import FollowedChallenges from "./components/FollowedChallenges";
import ChallengeList from "./components/ChallengeList";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Trophy, Users, List } from "lucide-react";

export default function ChallengePage() {
  const router = useRouter();

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
          <MyChallenges />
        </section>

        {/* 팔로우한 사람의 도전 */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#96b23c]" />
            팔로우한 사람의 도전
          </h2>
          <FollowedChallenges />
        </section>

        {/* 모든 도전 리스트 */}
        <section>
          <ChallengeList />
        </section>
      </main>
    </div>
  );
}
