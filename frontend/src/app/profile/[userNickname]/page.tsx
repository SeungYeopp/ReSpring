"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MessageSquare, UserPlus, UserMinus, Award, ArrowLeft, Flame, BookCheck, Footprints, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import StatSummary from "../components/stat-summary";
import TabBar from "../components/tabbar";
import { isSubscribed, newSubscription, cancelSubscription } from "@/lib/api/subscribe";
import { fetchParticipatedChallenges, getUserInfoByNickname } from "@/lib/api";
import BadgeModal from "../components/badge";
import { ParticipatedChallenge } from "@/app/tomorrow/types/challenge";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { userNickname: myNickname } = useAuth(true);
  const router = useRouter();
  const { userNickname } = useParams();
  const targetNickname = Array.isArray(userNickname) ? userNickname[0] : userNickname;
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [isSubscribedState, setIsSubscribedState] = useState(false);
  const [challenges, setChallenges] = useState<ParticipatedChallenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isMine = myNickname === decodeURIComponent(targetNickname);

  const handleBack = () => {
    router.back();
  };

  const checkIfSubscribed = async () => {
    try {
      const subscribed = await isSubscribed(targetNickname);
      setIsSubscribedState(subscribed);
    } catch (error) {
      console.error("Error checking subscription status:", error);
    }
  };

  const handleSubscribeUnsubscribe = async () => {
    try {
      if (isSubscribedState) {
        const success = await cancelSubscription(targetNickname);
        if (success) setIsSubscribedState(false);
      } else {
        const success = await newSubscription(targetNickname);
        if (success) setIsSubscribedState(true);
      }
    } catch (error) {
      console.error("Failed to update subscription status:", error);
    }
  };


  const openBadgeModal = (badge: string) => {
    setSelectedBadge(badge);
  };

  const closeBadgeModal = () => {
    setSelectedBadge(null);
  };

  useEffect(() => {
    checkIfSubscribed();
  }, [targetNickname]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const result = await fetchParticipatedChallenges();
        setChallenges(result);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [targetNickname]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfoByNickname(decodeURI(targetNickname));
        setProfilePic(userInfo.profileImageUrl || "/placeholder_profilepic.png");
      } catch (err) {
        setProfilePic("/placeholder_profilepic.png");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [targetNickname]);

  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(true); // 기본값은 데스크탑

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDesktop(window.innerWidth >= 1024); // 1024px 이상이면 데스크탑
    }

    // 페이지 로드 후 3초 동안 자동 표시 후, 사용자가 직접 닫아야 함
    setIsTooltipOpen(true);
    const timeout = setTimeout(() => {
      setIsTooltipOpen(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);



  return (
    <TooltipProvider>
    <main className="min-h-screen bg-gray-50/50 md:-my-4">
      {/* 웹/태블릿 레이아웃 */}
      
      <div className="hidden lg:grid lg:grid-cols-[1fr_2fr] lg:gap-6 lg:px-6">
        {/* 프로필 섹션 */}
        <div className="flex flex-col items-center">
          <button onClick={handleBack} className="self-start mb-4 p-2 rounded-full bg-white shadow-md">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* 프로필 이미지 */}
          <div className="relative w-40 h-40 rounded-full bg-white shadow-lg">
            <img src={profilePic || "/placeholder_profilepic.png"} className="w-full h-full rounded-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-6">{decodeURIComponent(targetNickname)}</h1>

          {/* 구독 & 채팅 버튼 */}
          {myNickname !== decodeURIComponent(targetNickname) && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleSubscribeUnsubscribe}
                className={`flex items-center justify-center py-2 px-6 text-sm md:text-base font-medium text-white rounded-lg shadow-md transition duration-200 ${
                  isSubscribedState ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isSubscribedState ? (
                  <>
                    <UserMinus className="w-5 h-5 mr-2" /> 구독 취소
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" /> 구독하기
                  </>
                )}
              </button>

              <button
                onClick={() => router.push(`/chat?targetNickname=${targetNickname}`)}
                className="flex items-center justify-center py-2 px-6 text-sm md:text-base font-medium text-white bg-green-500 rounded-lg shadow-md transition duration-200 hover:bg-green-600"
              >
                <MessageSquare className="w-5 h-5 mr-2" /> 채팅하기
              </button>
            </div>
          )}

        </div>

        {/* 내 업적 - 프로필과 같은 높이에 정렬 */}
        <div className="mt-8">
          
          {/* 획득한 배지 + 물음표 아이콘을 같은 줄에 배치 */}
          <div className="flex items-center gap-2 ml-4 mt-8">
            <span className="text-sm text-gray-400">획득한 뱃지</span>

            {/* 도움말 버튼 */}
            <Tooltip open={isTooltipOpen} onOpenChange={(open) => setIsTooltipOpen(open)}>
              <TooltipTrigger asChild>
                <button
                  className="focus:outline-none w-6 h-6 flex item-end justify-center mt-2"
                  onClick={() => setIsTooltipOpen((prev) => !prev)} // 클릭 시 상태 토글
                >
                  <HelpCircle className="w-4 h-4 text-gray-500 hover:text-brand cursor-pointer" />
                </button>
              </TooltipTrigger>

              {/* 도움말 위치 */}
              <TooltipContent
                side="bottom"
                align="start"
                className="bg-gray-800 text-white text-sm rounded-lg p-3 mt-2 shadow-lg max-w-xs w-64 z-50 relative"
              >
                {/* 툴팁 내부 우측 상단에 물음표 위치 */}
                🏅 도전하고, 성장하며, 특별한 배지를 만나보세요.
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex gap-2 mb-4 ml-4">
            {[
              { id: "flame", icon: <Flame className="w-5 h-5 text-red-500" /> },
              { id: "bookCheck", icon: <BookCheck className="w-5 h-5 text-green-500" /> },
              { id: "footprints", icon: <Footprints className="w-5 h-5 text-blue-500" /> },
            ].map((badge) => (
              <button key={badge.id} onClick={() => openBadgeModal(badge.id)}>
                {badge.icon}
              </button>
            ))}
          </div>
          
          <div className="flex items-center justify-end">
            <StatSummary userNickname={targetNickname} challengeCount={challenges.length} />
          </div>

        </div>
        
        {/* 모달 표시 */}
        {selectedBadge && <BadgeModal badge={selectedBadge} onClose={closeBadgeModal} />}


        {/* 도전, 활동, 발자취 */}
        <div className="lg:col-span-2 flex flex-col items-center mt-0 w-full">
          <TabBar userNickname={targetNickname} challenges={challenges} isMine={isMine} />
        </div>
        
      </div>
      

      {/* 모바일 및 작은 화면 레이아웃 */}
      <div className="lg:hidden flex flex-col items-start w-full px-4">
        <div className="w-full flex justify-start mt-6">
          <button onClick={handleBack} className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="relative self-center">
          <div className="w-40 h-40 rounded-full border-4 border-white bg-white shadow-xl">
            <img src={profilePic || "/placeholder_profilepic.png"} className="w-full h-full rounded-full object-cover" />
          </div>
        </div>

        <div className="relative w-full flex flex-col items-center my-8">
          {/* 닉네임 (중앙 정렬) */}
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            {decodeURIComponent(targetNickname)}
          </h1>

          {myNickname !== decodeURIComponent(targetNickname) && (
            <div className="flex gap-3 mt-2">
              <button
                onClick={handleSubscribeUnsubscribe}
                className={`flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md shadow-lg ${
                  isSubscribedState ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isSubscribedState ? (
                  <>
                    <UserMinus className="w-4 h-4 mr-2" /> 구독 취소하기
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" /> 구독하기
                  </>
                )}
              </button>
              <button
                onClick={() => router.push(`/chat?targetNickname=${targetNickname}`)}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 shadow-lg"
              >
                <MessageSquare className="w-4 h-4 mr-2" /> 채팅하기
              </button>

            
          </div>
          )}

        </div>

        {/* 획득한 배지 */}
        <div className="flex justify-end w-full">
          <div className="right-2 top-3 gap-2 mr-6 mb-6">
              <div className="flex justify-end">
                <Tooltip open={isTooltipOpen} onOpenChange={(open) => setIsTooltipOpen(open)}>
                  <TooltipTrigger asChild>
                    <button
                      className="focus:outline-none w-6 h-6 flex justify-center"
                      onClick={() => setIsTooltipOpen((prev) => !prev)} // 클릭 시 상태 토글
                    >
                      <HelpCircle className="w-4 h-4 text-gray-500 hover:text-brand cursor-pointer" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    align="end"
                    className="bg-gray-800 text-white text-sm rounded-lg p-3 my-3 shadow-lg max-w-xs w-64 z-50"
                  >
                    🏅 도전하고, 성장하며, 특별한 배지를 만나보세요.
                  </TooltipContent>
                </Tooltip>
                <span className="text-xs text-gray-400 ml-1">획득한 뱃지</span>


              </div>

              <div className="flex gap-2 mb-4 ml-4">
                {[
                  { id: "flame", icon: <Flame className="w-5 h-5 text-red-500" /> },
                  { id: "bookCheck", icon: <BookCheck className="w-5 h-5 text-green-500" /> },
                  { id: "footprints", icon: <Footprints className="w-5 h-5 text-blue-500" /> },
                ].map((badge) => (
                  <button key={badge.id} onClick={() => openBadgeModal(badge.id)}>
                    {badge.icon}
                  </button>
                ))}
              </div>
            </div>
        </div>

        {/* 내 업적 */}
        <StatSummary userNickname={targetNickname} challengeCount={challenges.length} />

        {selectedBadge && <BadgeModal badge={selectedBadge} onClose={closeBadgeModal} />}

        {/* 도전, 활동, 발자취 - 왼쪽 정렬 */}
        <div className="w-full flex flex-col items-start">
          <TabBar userNickname={targetNickname} challenges={challenges} isMine={isMine} />
        </div>


      </div>
    </main>
    </TooltipProvider>
  );
}