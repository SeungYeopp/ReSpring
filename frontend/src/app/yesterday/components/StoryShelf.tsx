'use client';

import { useState, useEffect, useRef } from "react";
import { getAllStories, deleteStory } from "@/lib/api/story";
import { getAllEvents } from "@/lib/api/event";

interface Story {
  id: number;
  title: string;
  createdAt: string | Date;
  content: string;
  eventId: number;
  coverImg?: string;
}

interface Event {
  id: number;
  eventName: string;
}

interface StoryShelfProps {
  userId: string;
}

const StoryShelf: React.FC<StoryShelfProps> = ({ userId }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [storiesPerShelf, setStoriesPerShelf] = useState(4);
  const [storyWidth, setStoryWidth] = useState(160);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleDelete = async (storyId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteStory(storyId, userId);
      setStories((prevStories) => prevStories.filter((story) => story.id !== storyId));
    } catch (error) {
      console.error("Error deleting story:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const fetchStoriesAndEvents = async () => {
      try {
        const [fetchedStories, fetchedEvents] = await Promise.all([
          getAllStories(userId),
          getAllEvents(userId)
        ]);

        setStories(
          fetchedStories.map((story) => ({
            ...story,
            createdAt: new Date(story.createdAt).toISOString(),
          }))
        );

        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStoriesAndEvents();
  }, [userId]);

  useEffect(() => {
    const updateLayout = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        let storiesToShow = containerWidth < 500 ? 2 : containerWidth < 800 ? 3 : 4;
        setStoriesPerShelf(storiesToShow);
        setStoryWidth(((containerWidth - 32) * 0.7) / storiesToShow);
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [stories]);

  const getEventName = (eventId: number) => {
    const event = events.find((e) => e.id === eventId);
    return event ? event.eventName : "Unknown Event";
  };

  const shelves = [];
  for (let i = 0; i < stories.length; i += storiesPerShelf) {
    shelves.push(stories.slice(i, i + storiesPerShelf));
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full p-4">
      {shelves.map((shelf, index) => (
        <div key={index} className="flex flex-col items-center mb-6">
          <div className="flex justify-center gap-6 w-full">
            {shelf.map((story) => (
              <div
                key={story.id}
                className="group relative"
                style={{
                  width: `${storyWidth}px`,
                  height: `${(storyWidth / 160) * 240}px`,
                }}
              >
                <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
                    <img
                      src={story.coverImg || "/placeholder_storycover.png"}
                      alt={`Story ${story.title}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex flex-col justify-start p-2">
                      <h1 className="text-lg font-bold text-center ml-2 w-full py-1">
                        {story.title}
                      </h1>
                      <p className="text-xs text-center ml-4 mt-2 line-clamp-6 px-2">
                        {story.content}
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white text-sm p-2 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <p>사건: {getEventName(story.eventId)}</p>
                    <p className="mt-1">작성일: {new Date(story.createdAt).toLocaleDateString()}</p>
                    <div className="mt-2 flex space-x-2">
                      <a
                        href={`/viewer/${story.id}`}
                        className="px-3 py-1 bg-green-500 text-white rounded-md text-xs hover:bg-green-600"
                      >
                        편집
                      </a>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(story.id);
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600"
                      >
                        삭제
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
          <img src="/shelf.png" alt="Bookshelf" width={1909} height={152} />
        </div>
      ))}
    </div>
  );
};

export default StoryShelf;
