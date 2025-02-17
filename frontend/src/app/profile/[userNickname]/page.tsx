'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, LogOut, UserPlus, UserMinus } from "lucide-react";
import StatSummary from "../components/stat-summary";
import TabBar from "../components/tabbar";
import { isSubscribed, newSubscription, cancelSubscription } from "@/lib/api/subscribe";
import { fetchParticipatedChallenges } from "@/lib/api";
import SubscribersModal from "../components/subscribers";
import { logout } from "@/lib/api";
import { ParticipatedChallenge } from "@/app/tomorrow/types/challenge";
import BadgeModal from "../components/badge";
import OtherFootsteps from "../components/other-footsteps";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { userNickname: myNickname } = useAuth(true);
  const router = useRouter();
  const { userNickname } = useParams();
  const targetNickname = Array.isArray(userNickname) ? userNickname[0] : userNickname;
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [isSubscribedState, setIsSubscribedState] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [challenges, setChallenges] = useState<ParticipatedChallenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/main";
  };

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

  return (
    <main className="relative -mt-4">
      <button onClick={handleBack} className="absolute top-6 left-6 p-2 text-xl text-gray-600 hover:text-gray-800 z-0">
        <ArrowLeft />
      </button>

      <div className="top-0 left-0 w-full h-[120px] md:h-[200px] z-0">
        <img src="/placeholder_profilebanner.jpg" alt="Top Banner" className="w-full h-full object-cover" />
      </div>

      <div className="relative flex flex-col md:flex-row gap-4 pt-4 z-10">
        <div className="flex flex-col md:flex-[0.7] gap-4">
          <div className="flex justify-center items-center h-auto -mt-20 md:-mt-24">
            <div className="w-[125px] h-[125px] md:w-[160px] md:h-[160px] rounded-full bg-white flex justify-center items-center">
              <img src="/placeholder_profilepic.png" alt="User Profile" className="w-[120px] md:w-[150px] rounded-full object-cover drop-shadow-lg" />
            </div>
          </div>

          <div className="flex justify-center items-center pt-2 text-3xl">
            <b>{decodeURIComponent(targetNickname)}</b>
          </div>

          <StatSummary userNickname={targetNickname} challengeCount={challenges.length} />

          <div className="flex justify-center items-start text-sm">
            <div className="flex gap-x-4">
              <button onClick={() => openBadgeModal("badge1")}> <img src="/badge1.png" alt="새로 가입" className="h-[48px]" /> </button>
              <button onClick={() => openBadgeModal("badge2")}> <img src="/badge2.png" alt="첫 방문" className="h-[48px]" /> </button>
            </div>
          </div>
          {selectedBadge && <BadgeModal badge={selectedBadge} onClose={closeBadgeModal} />}

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
            {myNickname === decodeURIComponent(targetNickname) ? (
              <button onClick={handleLogout} className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700">
                <LogOut className="w-4 h-4 mr-2" /> 로그아웃
              </button>
            ) : (
              <button onClick={handleSubscribeUnsubscribe} className={`flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md ${isSubscribedState ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}>
                {isSubscribedState ? <><UserMinus className="w-4 h-4 mr-2" /> 구독 취소하기</> : <><UserPlus className="w-4 h-4 mr-2" /> 구독하기</>}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-[1.3] justify-start items-center">
          {myNickname === decodeURIComponent(targetNickname) ? (
            <TabBar userNickname={targetNickname} challenges={challenges} />
          ) : (
            <div className="mt-8 w-[80%]">
              <OtherFootsteps userNickname={targetNickname} />
            </div>
          )}
        </div>
      </div>
      {isModalOpen && <SubscribersModal onClose={() => setIsModalOpen(false)} />}
    </main>
  );
}
