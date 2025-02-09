'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import StatSummary from "../components/stat-summary";
import TabBar from "../components/tabbar";
import { getAllSubscribers, newSubscription, cancelSubscription } from "@/lib/api/subscribe";

export default function ProfilePage() {
  const myId = "beb9ebc2-9d32-4039-8679-5d44393b7252";
  const { urlId } = useParams();
  const targetId = urlId && !Array.isArray(urlId) ? urlId : myId;
  const [isSubscribed, setIsSubscribed] = useState(false);
  const checkIfSubscribed = async () => {
    try {
      const subscribers = await getAllSubscribers(myId);
      const targetIsSubscribed = subscribers.some((subscriber) => subscriber.id === targetId);
      setIsSubscribed(targetIsSubscribed);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    }
  };
  const handleSubscribeUnsubscribe = async () => {
    if (isSubscribed) {
      try {
        const success = await cancelSubscription(myId, targetId);
        if (success) {
          setIsSubscribed(false);
        }
      } catch (error) {
        console.error("Failed to unsubscribe:", error);
      }
    } else {
      try {
        const success = await newSubscription(myId, targetId);
        if (success) {
          setIsSubscribed(true);
        }
      } catch (error) {
        console.error("Failed to subscribe:", error);
      }
    }
  };
  useEffect(() => {
    if (myId !== targetId) {
      checkIfSubscribed();
    }
  }, [myId, targetId]);

  return (
    <main className="relative -mt-4">
      <div className="top-0 left-0 w-full h-[150px] md:h-[200px] z-0">
        <img
          src="/placeholder_profilebanner.jpg"
          alt="Top Banner"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative flex flex-col md:flex-row gap-4 pt-4 z-10">
        <div className="flex flex-col md:flex-[0.7] gap-4">
          <div className="flex justify-center items-center h-auto -mt-24">
            <div className="w-[160px] h-[160px] rounded-full bg-white flex justify-center items-center">
              <img 
                src="/placeholder_profilepic.png" 
                alt="User Profile" 
                className="w-[150px] h-[150px] rounded-full object-cover drop-shadow-lg"
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
          
          {myId === targetId ? (
            <button
              className="bg-blue-500 text-white text-xl px-4 py-2 w-[50%] rounded-md mt-4 mx-auto block"
              onClick={() => window.location.href = "#"}
            >
              구독자 목록
            </button>
          ) : (
            <button
              className={`${
                isSubscribed ? "bg-red-500" : "bg-green-500"
              } text-white text-xl px-4 py-2 w-[50%] rounded-md mt-4 mx-auto block`}
              onClick={handleSubscribeUnsubscribe}
            >
              {isSubscribed ? "구독 취소하기" : "구독하기"}
            </button>
          )}
        </div>
        <div className="flex flex-col md:flex-[1.3] justify-start items-center">
          <TabBar userId={targetId} />
        </div>
      </div>
    </main>
  );
}
