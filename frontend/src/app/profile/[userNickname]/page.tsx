'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, UserPlus, UserMinus, Award, Flame, BookCheck, Footprints } from 'lucide-react';
import StatSummary from "../components/stat-summary";
import TabBar from "../components/tabbar";
import { isSubscribed, newSubscription, cancelSubscription } from "@/lib/api/subscribe";
import { fetchParticipatedChallenges, getUserInfoByNickname } from "@/lib/api";
import { ParticipatedChallenge } from "@/app/tomorrow/types/challenge";
import BadgeModal from "../components/badge";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { userNickname: myNickname } = useAuth(true);
  const router = useRouter();
  const { userNickname } = useParams();
  const targetNickname = Array.isArray(userNickname) ? userNickname[0] : userNickname;
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [isSubscribedState, setIsSubscribedState] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        setError("Failed to fetch challenges");
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
        console.error("Error fetching user info:", err);
        setProfilePic("/placeholder_profilepic.png");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [targetNickname]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="relative h-[120px] ">
        <button 
          onClick={handleBack} 
          className="absolute top-6 left-6 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white/100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2">
          <div className="relative">
            <div className="w-40 h-40 rounded-full border-4 border-white bg-white shadow-xl">
              <img 
                src={profilePic || "/placeholder_profilepic.png"} 
                alt="User Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 pt-24">
        <div className="relative flex flex-col items-center space-y-6">
          {/* 닉네임 중앙 정렬 & 배지 우측 정렬 */}
          <div className="w-full relative flex justify-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {decodeURIComponent(targetNickname)}
            </h1>
            
            {/* 획득한 배지 (우측 정렬) */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col items-end">
              {/* 획득한 배지 텍스트 */}
              <span className="text-xs text-gray-400 mb-1 mr-3">획득한 뱃지</span>
              
              {/* 뱃지 아이콘 */}
              <div className="flex mr-3">
                {[
                  { id: "flame", icon: <Flame className="w-4 h-4 text-red-500" /> },
                  { id: "bookCheck", icon: <BookCheck className="w-4 h-4 text-green-500" /> },
                  { id: "footprints", icon: <Footprints className="w-4 h-4 text-blue-500" /> },
                ].map((badge) => (
                  <button
                    key={badge.id}
                    onClick={() => openBadgeModal(badge.id)}
                    className="group relative p-1 transition-all hover:scale-110"
                  >
                    {badge.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>


          {/* 모달 표시 */}
          {selectedBadge && <BadgeModal badge={selectedBadge} onClose={closeBadgeModal} />}

          <StatSummary userNickname={targetNickname} challengeCount={challenges.length} />

          {myNickname !== decodeURIComponent(targetNickname) && (
            <div className="flex gap-3">
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
                onClick={() => {}}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 shadow-lg"
              >
                <MessageSquare className="w-4 h-4 mr-2" /> 채팅하기
              </button>
            </div>
          )}
        </div>

        <div className="mt-12">
          <TabBar userNickname={targetNickname} challenges={challenges} isMine={isMine} />
        </div>
      </div>
    </main>
  );
}
