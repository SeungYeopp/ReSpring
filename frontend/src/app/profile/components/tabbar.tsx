"use client";

import { useState } from "react";
import Footsteps from "./footsteps";
import CommunityPosts from "./my-activities";
import Challenges from "./challenges";
import { ParticipatedChallenge } from "@/app/tomorrow/types/challenge";

interface TabBarProps {
  userNickname: string;
  challenges: ParticipatedChallenge[];
}

export const TabBar: React.FC<TabBarProps> = ({ userNickname, challenges }) => {
  const [selectedTab, setSelectedTab] = useState("challenges");

  return (
    <div className="flex flex-col items-center mt-8 w-full px-4 font-bold">
      <div className="flex flex-row w-full justify-center md:justify-start space-x-6 md:text-2xl text-xl md:space-x-10 md:items-start text-center">
        <button
          onClick={() => setSelectedTab("challenges")}
          className={`text-left ${selectedTab === "challenges" ? "text-brand-light" : "text-gray-400"}`}
        >
          도전
        </button>
        <button
          onClick={() => setSelectedTab("my-activities")}
          className={`text-left ${selectedTab === "my-activities" ? "text-brand-light" : "text-gray-400"}`}
        >
          활동
        </button>
        <button
          onClick={() => setSelectedTab("footsteps")}
          className={`text-left ${selectedTab === "footsteps" ? "text-brand-light" : "text-gray-400"}`}
        >
          발자취
        </button>
      </div>

      <div className="mt-8 w-full">
        {selectedTab === "footsteps" && <Footsteps userNickname={userNickname} />}
        {selectedTab === "my-activities" && <CommunityPosts userNickname={userNickname} />}
        {selectedTab === "challenges" && <Challenges challenges={challenges} />}
      </div>
    </div>
  );
};

export default TabBar;
