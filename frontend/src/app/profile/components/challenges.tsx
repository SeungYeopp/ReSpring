import Link from "next/link";
import { ParticipatedChallenge } from "@/app/tomorrow/types/challenge";
import React from "react";

interface ChallengeListProps {
  challenges: ParticipatedChallenge[];
}

const Challenges: React.FC<ChallengeListProps> = ({ challenges }) => {
  if (!challenges || challenges.length === 0) {
    return <div className="text-center text-gray-500">참여한 도전이 없습니다.</div>;
  }

  return (
    <div>
      {challenges.map((challenge) => (
        <Link key={challenge.id} href={`/tomorrow/${challenge.id}`} passHref>
          <div className="bg-white rounded-2xl overflow-hidden w-full shadow-sm hover:shadow-md transition-shadow duration-300 mb-4 cursor-pointer">
            <div className="flex p-4">
              <div className="w-[80px] xs:w-[100px] sm:w-[120px] mr-4">
                <div className="relative w-full aspect-square">
                  <img 
                    src={challenge.image || "/placeholder_badge.svg"} 
                    alt={challenge.title} 
                    className="rounded-xl object-cover" 
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-lg sm:text-xl font-bold mb-1">{challenge.title}</h3>
                {challenge.tags && challenge.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {challenge.tags.map((tag) => (
                      <span 
                        key={tag.id} 
                        className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="w-[80px] xs:w-[100px] sm:w-[120px] flex flex-col items-center justify-center">
                <p className="font-bold text-4xl">{challenge.currentStreak}</p>
                <p className="text-sm text-gray-500">연속 달성</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Challenges;
