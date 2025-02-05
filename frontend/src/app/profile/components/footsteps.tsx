'use client';

import React from 'react';

interface FootstepsItem {
  id: string;
  title: string;
  date: string;
}

const footstepsData: FootstepsItem[] = [
  {
    id: '1',
    title: '졸업식',
    date: '1990년 1월',
  },
  {
    id: '2',
    title: '입사',
    date: '1990년 5월',
  },
  {
    id: '3',
    title: '30년 근속',
    date: '2020년 5월',
  },
  {
    id: '4',
    title: '은퇴',
    date: '2023년 10월',
  },
];

const Footsteps: React.FC = () => {
  const circleSize = 48;
  const animationDuration = 2;

  return (
    <div className="relative pl-6">
      <div className="relative">
        <div
          className="absolute left-[14%] top-0 w-[2px] bg-[#a46500]"
          style={{
            height: `${footstepsData.length * (circleSize + 24)}px`,
            animation: `lineExpand ${(footstepsData.length - 2) * animationDuration}s ease-out forwards`,
          }}
        />
        {footstepsData.map((item, index) => {
          const delay = `${index * 0.5}s`;
          return (
            <div
              key={item.id}
              className="flex items-start mb-8 relative opacity-0"
              style={{
                animation: `fadeInAndExpand ${animationDuration}s ease-out forwards ${delay}`,
              }}
            >
              <div
                className={`w-12 h-12 rounded-full border-2 border-white ${
                  index === 0 ? 'bg-[#a46500]' : 'bg-[#dfeaa5]'
                }`}
                style={{
                  animation: `circleExpand ${animationDuration}s ease-out forwards ${delay}`,
                }}
              ></div>
              <div
                className="flex flex-col ml-8 opacity-0"
                style={{
                  animation: `fadeInText ${animationDuration}s ease-out forwards ${parseFloat(delay) + 0.5}s`,
                }}
              >
                <div className="text-lg font-bold">{item.title}</div>
                <div className="text-sm text-gray-500">{item.date}</div>
              </div>
            </div>
          );
        })}
      </div>
      <style jsx global>{`
        @keyframes circleExpand {
          0% {
            transform: scale(0);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes fadeInText {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes fadeInAndExpand {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes lineExpand {
          0% {
            height: 0;
          }
          100% {
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Footsteps;