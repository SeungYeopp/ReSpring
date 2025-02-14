"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import StatSummary from "../components/stat-summary";
import TabBar from "../components/tabbar";
import { isSubscribed, newSubscription, cancelSubscription } from "@/lib/api/subscribe";
import SubscribersModal from "../components/subscribers";

export default function ProfilePage() {
  const router = useRouter();
  const myId = "beb9ebc2-9d32-4039-8679-5d44393b7252";
  const { id } = useParams();
  const targetId = Array.isArray(id) ? id[0] : id;

  const [isSubscribedState, setIsSubscribedState] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const checkIfSubscribed = async () => {
    try {
      const subscribed = await isSubscribed(myId, targetId);
      setIsSubscribedState(subscribed);
    } catch (error) {
      console.error("Error checking subscription status:", error);
    }
  };

  const handleSubscribeUnsubscribe = async () => {
    try {
      if (isSubscribedState) {
        const success = await cancelSubscription(myId, targetId);
        if (success) setIsSubscribedState(false);
      } else {
        const success = await newSubscription(myId, targetId);
        if (success) setIsSubscribedState(true);
      }
    } catch (error) {
      console.error("Failed to update subscription status:", error);
    }
  };

  useEffect(() => {
    if (myId !== targetId) {
      checkIfSubscribed();
    }
  }, [myId, targetId]);

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
            <b>김싸피</b>
          </div>

          <StatSummary userId={targetId} />

          <div className="flex justify-center items-start text-sm">
            <div className="flex">
              <img src="/placeholder_badge.svg" alt="Badge" className="w-[48px]" />
              <img src="/placeholder_badge.svg" alt="Badge" className="w-[48px]" />
              <img src="/placeholder_badge.svg" alt="Badge" className="w-[48px]" />
              <img src="/placeholder_badge.svg" alt="Badge" className="w-[48px]" />
            </div>
          </div>
{/* 
          {myId === targetId ? (
            <button
              className="bg-blue-500 text-white text-xl px-4 py-2 w-[50%] rounded-md mt-4 mx-auto block"
              onClick={() => setIsModalOpen(true)}
            >
              구독자 목록
            </button>
          ) : (
            <button
              className={`${
                isSubscribedState ? "bg-red-500" : "bg-green-500"
              } text-white text-xl px-4 py-2 w-[50%] rounded-md mt-4 mx-auto block`}
              onClick={handleSubscribeUnsubscribe}
            >
              {isSubscribedState ? "구독 취소하기" : "구독하기"}
            </button>
          )} */}
        </div>

        <div className="flex flex-col md:flex-[1.3] justify-start items-center">
          <TabBar userId={targetId} />
        </div>
      </div>

      {isModalOpen && <SubscribersModal userId={myId} onClose={() => setIsModalOpen(false)} />}
    </main>
  );
}
