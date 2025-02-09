'use client';

import { useState } from "react";
import Footsteps from "./footsteps";
import CommunityPosts from "./my-activities";

export const Tabbar: React.FC<{ userId: string }> = ({ userId }) => {
  const [selectedTab, setSelectedTab] = useState("footsteps");

  return (
    <div className="flex flex-col items-center mt-8 w-full px-4 font-bold">
      <div className="flex flex-row w-full justify-center md:justify-start space-x-6 md:text-2xl text-xl md:space-x-10 md:items-start text-center">
        <button
          onClick={() => setSelectedTab("footsteps")}
          className={`text-left ${selectedTab === "footsteps" ? "text-brand-light" : "text-gray-400"}`}
        >
          발자취
        </button>
        <button
          onClick={() => setSelectedTab("sub-activities")}
          className={`text-left ${selectedTab === "sub-activities" ? "text-brand-light" : "text-gray-400"}`}
        >
          구독자 활동
        </button>
        <button
          onClick={() => setSelectedTab("my-activities")}
          className={`text-left ${selectedTab === "my-activities" ? "text-brand-light" : "text-gray-400"}`}
        >
          나의 활동
        </button>
        <button
          onClick={() => setSelectedTab("achievements")}
          className={`text-left ${selectedTab === "achievements" ? "text-brand-light" : "text-gray-400"}`}
        >
          성취
        </button>
      </div>

      <div className="mt-8 w-full">
        {selectedTab === "footsteps" && <Footsteps userId={userId} />}
        {selectedTab === "sub-activities" && <div>구독자 활동 Content</div>}
        {selectedTab === "my-activities" && <CommunityPosts />}
        {selectedTab === "achievements" && <div>성취 Content</div>}
      </div>
    </div>
  );
};

export default Tabbar;
