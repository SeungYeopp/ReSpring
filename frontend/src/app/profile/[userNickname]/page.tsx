"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Flame, BookCheck, Footprints } from 'lucide-react';
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


  return (
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

          
        </div>

        {/* 내 업적 - 프로필과 같은 높이에 정렬 */}
        <div className="mt-8">
          {/* 획득한 배지 */}
          <div className="mt-4 mb-2 text-sm text-gray-400 mb-3 ml-4 mt-8">획득한 뱃지</div>
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

          {/* 획득한 배지 */}
          <div className="absolute right-4 top-1 items-center gap-2 ">
            <span className="text-xs text-gray-400">획득한 뱃지</span>
            <div className="flex space-x-2">
              {[
                { id: "flame", icon: <Flame className="w-4 h-4 text-red-500" /> },
                { id: "bookCheck", icon: <BookCheck className="w-4 h-4 text-green-500" /> },
                { id: "footprints", icon: <Footprints className="w-4 h-4 text-blue-500" /> },
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

        {/* 도전, 활동, 발자취 - 왼쪽 정렬 */}
        <div className="w-full flex flex-col items-start pl-4">
          <TabBar userNickname={targetNickname} challenges={challenges} isMine={isMine} />
        </div>


      </div>
    </main>
  );
}
