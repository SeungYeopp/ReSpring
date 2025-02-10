"use client";

import { useState, useEffect } from "react";
import { getAllSubscribers, isSubscribed, newSubscription, cancelSubscription } from "@/lib/api/subscribe";
import { Subscriber } from "@/lib/api/subscribe"; // Import the Subscriber interface

interface SubscribersModalProps {
  userId: string;
  onClose: () => void;
}

export default function SubscribersModal({ userId, onClose, }: SubscribersModalProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscriptions, setSubscriptions] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const fetchedSubscribers = await getAllSubscribers(userId);
        setSubscribers(fetchedSubscribers);

        const subscriptionsStatus: { [key: string]: boolean } = {};
        for (const subscriber of fetchedSubscribers) {
          subscriptionsStatus[subscriber.id] = await isSubscribed(userId, subscriber.id);
        }
        setSubscriptions(subscriptionsStatus);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
      }
    };

    fetchSubscribers();
  }, [userId, userId]);

  const handleSubscribeToggle = async (subscriberId: string) => {
    try {
      if (subscriptions[subscriberId]) {
        await cancelSubscription(userId, subscriberId);
        setSubscriptions((prev) => ({ ...prev, [subscriberId]: false }));
      } else {
        await newSubscription(userId, subscriberId);
        setSubscriptions((prev) => ({ ...prev, [subscriberId]: true }));
      }
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-lg p-6 rounded-md shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">구독자 목록</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-xl">X</button>
        </div>
        <div className="mt-4 space-y-4">
          {subscribers.map((subscriber) => (
            <div key={subscriber.id} className="flex justify-between items-center p-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <img
                  src={subscriber.profileImage || "/placeholder_profilepic.png"}
                  alt={subscriber.nickname}
                  className="w-[40px] h-[40px] rounded-full object-cover"
                />
                <span className="text-lg font-semibold">{subscriber.nickname}</span>
              </div>
              <button
                className={`text-sm px-4 py-2 rounded-md ${subscriptions[subscriber.id] ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
                onClick={() => handleSubscribeToggle(subscriber.id)}
              >
                {subscriptions[subscriber.id] ? "구독 취소" : "구독하기"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
