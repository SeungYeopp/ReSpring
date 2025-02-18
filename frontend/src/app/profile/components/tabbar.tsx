"use client";

import { useEffect, useState } from "react";
import Footsteps from "./footsteps";
import CommunityPosts from "./my-activities";
import Challenges from "./challenges";
import { ParticipatedChallenge } from "@/app/tomorrow/types/challenge";
import OtherFootsteps from "./other-footsteps";

interface TabBarProps {
  userNickname: string;
  challenges: ParticipatedChallenge[];
  isMine: boolean;
}

export const TabBar: React.FC<TabBarProps> = ({ userNickname, challenges, isMine }) => {
  const [selectedTab, setSelectedTab] = useState("other-footsteps");

  useEffect(() => {
    setSelectedTab(isMine ? "challenges" : "other-footsteps");
  }, [isMine]);

  return (
    <div className="flex flex-col items-center mt-8 w-full px-4 font-bold">
        {isMine ? (
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
        ) : 
        <div className="flex flex-row w-full justify-center md:justify-start space-x-6 md:text-2xl text-xl md:space-x-10 md:items-start text-center">
          <button
            onClick={() => setSelectedTab("other-footsteps")}
            className={`text-left ${selectedTab === "other-footsteps" ? "text-brand-light" : "text-gray-400"}`}
          >
            발자취
          </button>
        </div>
        }

      <div className="mt-8 w-full">
        {selectedTab === "challenges" && <Challenges challenges={challenges} />}
        {selectedTab === "my-activities" && <CommunityPosts userNickname={userNickname} />}
        {selectedTab === "footsteps" && <Footsteps userNickname={userNickname} />}
        {selectedTab === "other-footsteps" && <OtherFootsteps userNickname={userNickname} />}
      </div>
    </div>
  );
};

export default TabBar;
