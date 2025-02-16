'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, LogOut, UserPlus, UserMinus } from "lucide-react";
import StatSummary from "../components/stat-summary";
import TabBar from "../components/tabbar";
import { isSubscribed, newSubscription, cancelSubscription } from "@/lib/api/subscribe";
import { UserInfo, fetchParticipatedChallenges, getSessionInfo } from "@/lib/api";
import SubscribersModal from "../components/subscribers";
import Link from "next/link";
import { logout } from "@/lib/api";
import { ParticipatedChallenge } from "@/app/tomorrow/types/challenge";

export default function ProfilePage() {
  const handleLogout = async () => {
    await logout();
    window.location.href = "/main";
  };

  const router = useRouter();
  const { userNickname } = useParams();
  const targetNickname = Array.isArray(userNickname) ? userNickname[0] : userNickname;
  const [mySession, setSession] = useState<UserInfo | null>(null);
  const [myNickname, setMyNickname] = useState<string | null>(null);

  const [isSubscribedState, setIsSubscribedState] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [challenges, setChallenges] = useState<ParticipatedChallenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch the session info on mount
  useEffect(() => {
    const fetchMySession = async () => {
      try {
        const result = await getSessionInfo();
        setSession(result);
      } catch (error) {
        console.error("Failed to fetch session info:", error);
      }
    };

    fetchMySession();
  }, []);

  // Update myNickname after mySession is set
  useEffect(() => {
    if (mySession && mySession.userNickname) {
      setMyNickname(mySession.userNickname);
    }
  }, [mySession]); // This will run every time mySession changes

  return (
    <main className="relative -mt-4">
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 p-2 text-xl text-gray-600 hover:text-gray-800 z-0"
      >
        <ArrowLeft />
      </button>

      <div className="top-0 left-0 w-full h-[120px] md:h-[200px] z-0">
        <img
          src="/placeholder_profilebanner.jpg"
          alt="Top Banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative flex flex-col md:flex-row gap-4 pt-4 z-10">
        <div className="flex flex-col md:flex-[0.7] gap-4">
          <div className="flex justify-center items-center h-auto -mt-20 md:-mt-24">
            <div className="w-[125px] h-[125px] md:w-[160px] md:h-[160px] rounded-full bg-white flex justify-center items-center">
              <img
                src="/placeholder_profilepic.png"
                alt="User Profile"
                className="w-[120px] md:w-[150px] rounded-full object-cover drop-shadow-lg"
              />
            </div>
          </div>

          <div className="flex justify-center items-center pt-2 text-3xl">
            <b>{decodeURIComponent(targetNickname)}</b>
          </div>

          <StatSummary userNickname={targetNickname} challengeCount={challenges.length} />

          <div className="flex justify-center items-start text-sm">
            <div className="flex">
              <img
                src="/placeholder_badge.svg"
                alt="Badge"
                className="w-[48px]"
              />
              <img
                src="/placeholder_badge.svg"
                alt="Badge"
                className="w-[48px]"
              />
              <img
                src="/placeholder_badge.svg"
                alt="Badge"
                className="w-[48px]"
              />
              <img
                src="/placeholder_badge.svg"
                alt="Badge"
                className="w-[48px]"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
            {myNickname && myNickname === decodeURIComponent(targetNickname) ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </button>
            ) : (
              <button
                onClick={handleSubscribeUnsubscribe}
                className={`flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                  isSubscribedState
                    ? "bg-red-500 hover:bg-red-600 focus:ring-red-500"
                    : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
                }`}
              >
                {isSubscribedState ? (
                  <>
                    <UserMinus className="w-4 h-4 mr-2" />
                    구독 취소하기
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    구독하기
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-[1.3] justify-start items-center">
          <TabBar userNickname={targetNickname} challenges={challenges} />
        </div>
      </div>

      {isModalOpen && <SubscribersModal onClose={() => setIsModalOpen(false)} />}
    </main>
  );
}
