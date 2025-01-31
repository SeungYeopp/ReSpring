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
    title: 'Start of Journey',
    date: 'January 2020',
  },
  {
    id: '2',
    title: 'First Milestone',
    date: 'March 2021',
  },
  {
    id: '3',
    title: 'Big Achievement',
    date: 'July 2022',
  },
  {
    id: '4',
    title: 'Final Step',
    date: 'December 2023',
  },
];

const Footsteps: React.FC = () => {
  const circleSize = 48; // Circle size (48px = 12rem)
  const animationDuration = 2; // Duration for animations

  return (
    <div className="relative pl-6">
      {/* Container for circles and line */}
      <div className="relative">
        {/* Line Connecting the Circles */}
        <div
          className="absolute left-[10%] top-0 w-[2px] bg-[#a46500]"
          style={{
            height: `${footstepsData.length * (circleSize + 24)}px`, // Dynamically adjusting height based on items
            animation: `lineExpand ${(footstepsData.length - 2) * animationDuration}s ease-out forwards`, // Line animation
          }}
        />

        {/* Map through items to display each circle */}
        {footstepsData.map((item, index) => {
          // Calculate the dynamic delay based on the number of items
          const delay = `${index * 0.5}s`; // Stagger the animation
          return (
            <div
              key={item.id}
              className="flex items-start mb-8 relative opacity-0"
              style={{
                animation: `fadeInAndExpand ${animationDuration}s ease-out forwards ${delay}`,
              }}
            >
              {/* Circle with animation */}
              <div
                className={`w-12 h-12 rounded-full border-2 border-white ${
                  index === 0 ? 'bg-[#a46500]' : 'bg-[#dfeaa5]'
                }`}
                style={{
                  animation: `circleExpand ${animationDuration}s ease-out forwards ${delay}`,
                }}
              ></div>

              {/* Event Details */}
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

      {/* Add styles for animations */}
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