import Link from 'next/link';
import { fetchParticipatedChallenges } from '@/lib/api';
import { ParticipatedChallenge } from '@/app/tomorrow/types/challenge'; 
import React, { useState, useEffect } from 'react';

interface ChallengeListProps {
  userId: string;
}

const Challenges: React.FC<ChallengeListProps> = ({ userId: userNickname }) => {
  const [challenges, setChallenges] = useState<ParticipatedChallenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const result = await fetchParticipatedChallenges();
        setChallenges(result);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch challenges');
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [userNickname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {challenges.map((challenge) => (
        <Link key={challenge.id} href={`/tomorrow/${challenge.id}`} passHref>
          <div className="bg-white rounded-2xl overflow-hidden w-full shadow-sm hover:shadow-md transition-shadow duration-300 mb-4 cursor-pointer">
            <div className="flex p-1">
              <div className="w-[80px] xs:w-[100px] sm:w-[120px] mr-2 xs:mr-3 sm:mr-4">
                <div className="relative w-full aspect-square">
                  <img src={`${challenge.image}` || "/placeholder_badge.svg"} alt={challenge.title} className="rounded-xl object-cover" />
                </div>
              </div>
              <div className="flex-1 flex flex-col min-w-0 justify-center">
                <div className="mb-1 xs:mb-2">
                  <h3 className="text-xl font-bold mb-1 sm:mb-2 line-clamp-1">{challenge.title}</h3>
                  {challenge.tags && challenge.tags.length > 0 && (
                    <div className="mt-2">
                      {challenge.tags.map((tag) => (
                        <span 
                          key={tag.id} 
                          className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-100 rounded-full text-xs text-gray-600 whitespace-nowrap mr-1"
                        >
                          {tag.name}
                        </span>
                      ))}00
                    </div>
                  )}
                </div>
              </div>
              <div className="w-[80px] xs:w-[100px] sm:w-[120px] mr-2 xs:mr-3 sm:mr-4 relative aspect-square flex flex-col items-center justify-center">
                <p className="font-bold text-4xl">{challenge.currentStreak}</p>
                <p>연속 달성</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Challenges;
