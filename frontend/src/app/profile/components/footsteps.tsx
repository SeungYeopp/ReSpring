"use client";

import React, { useState, useEffect } from 'react';
import { getAllEvents, Event } from '@/lib/api/event';
import EditEvent from '@/components/custom/EditEvent';
import AddEvent from '@/components/custom/AddEvent';

const Footsteps: React.FC<{ userId: string }> = ({ userId }) => {
  const [footstepsData, setFootstepsData] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const events = await getAllEvents(userId);
      const formattedEvents = events.map(event => ({
        id: event.id,
        eventName: event.eventName,
        occurredAt: event.occurredAt,
        category: event.category,
        display: event.display,
      }));
      setFootstepsData(formattedEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleEventUpdated = async () => {
    await fetchEvents();
    setIsEditModalOpen(false);
  };

  const circleSize = 48;
  const animationDuration = 2; // Adjust this value to control circle animation duration

  // Calculate the total duration for the line animation
  const lineAnimationDuration = (footstepsData.length - 1) * 0.5 + animationDuration;

  return (
    <div className="relative pl-6">
      <div className="relative">
        <div
          className="absolute ml-[23px] top-0 w-[2px] bg-[#a46500]"
          style={{
            height: `${footstepsData.length * (circleSize + 24)}px`,
            animation: `lineExpand ${lineAnimationDuration}s ease-out forwards`,
          }}
        />
        {footstepsData.map((item, index) => {
          const delay = `${index * 0.5}s`;
          return (
            <div
              key={item.id}
              className="flex items-start mb-8 relative opacity-0 cursor-pointer"
              style={{
                animation: `fadeInAndExpand ${animationDuration}s ease-out forwards ${delay}`,
              }}
              onClick={() => handleEventClick(item)}
            >
              <div
                className={`w-12 h-12 rounded-full border-4 border-white ${
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
                <div className="text-lg font-bold">{item.eventName}</div>
                <div className="text-sm text-gray-500">{new Date(item.occurredAt).toLocaleDateString()}</div>
              </div>
            </div>
          );
        })}
      </div>

      {isEditModalOpen && selectedEvent && (
        <EditEvent
          event={selectedEvent}
          userId={userId}
          onClose={() => setIsEditModalOpen(false)}
          onEventUpdated={handleEventUpdated}
          onEventDeleted={handleEventUpdated}
        />
      )}

      <AddEvent onEventAdded={fetchEvents} />

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
