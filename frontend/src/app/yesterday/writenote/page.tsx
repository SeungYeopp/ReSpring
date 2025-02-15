"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getAllEvents, getStoryById, updateStory } from "@/lib/api";
import { makeStory } from "@/lib/api/story";
import SelectEvent from "../components/SelectEvent";
import StoryEditor from "../components/StoryEditor";
import AddEvent from "@/components/custom/AddEvent";

export default function WriteStoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<number | null>(null);
  const [selectedEventName, setSelectedEventName] = useState<string>("");
  const [events, setEvents] = useState<
    { id: number; eventName: string; occurredAt: string; category: string; display: boolean }[]
  >([]); 
  const [stage, setStage] = useState<"select" | "editor">("select");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [eventId, setEventId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [story, setStory] = useState<{ title: string; content: string } | null>(null);

  const userId = "beb9ebc2-9d32-4039-8679-5d44393b7252";

  const storyId = searchParams?.get("storyId") ? Number(searchParams.get("storyId")) : null;

  const fetchEvents = async () => {
    try {
      const fetchedEvents = await getAllEvents(userId);
      const formattedEvents = fetchedEvents.map((event) => ({
        id: event.id,
        eventName: event.eventName,
        occurredAt: new Date(event.occurredAt).toLocaleDateString(),
        category: event.category,
        display: event.display,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [userId]);

  useEffect(() => {
    if (storyId) {
      fetchStoryData(storyId);
      setStage("editor");
    } else {
      setStage("select");
    }
  }, [storyId]);

  const fetchStoryData = async (storyId: number) => {
    try {
      const fetchedStory = await getStoryById(storyId, userId);
      setStory(fetchedStory);
      setTitle(fetchedStory.title);
      setContent(fetchedStory.content);
      setEventId(fetchedStory.eventId);
    } catch (error) {
      console.error("Error fetching story:", error);
    }
  };

  const handleNext = async () => {
    if (selected !== null) {
      const event = events.find((event) => event.id === selected);
      if (event) {
        setSelectedEventName(event.eventName);
      }
    }

    setLoading(true);
    try {
      const deleteImageIds: number[] = [];

      if (storyId) {
        await updateStory(storyId, userId, title, content, eventId!, deleteImageIds, []);
        router.push(`/yesterday/booklist/${userId}?tab=stories`);
      } else {
        if (stage === "select") {
          setStage("editor");
        } else {
          const newStoryId = await makeStory(title, content, selected!, []);
          router.push(`/stories/${newStoryId}`);
        }
      }
    } catch (error) {
      console.error("Error saving story:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (stage === "editor") {
      router.push(`/yesterday/booklist/${userId}?tab=stories`);
    } else {
      router.back();
    }
  };

  const handleEventAdded = () => {
    fetchEvents();
  };

  return (
    <div className="relative p-6 -mt-4">
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="p-2 text-xl text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-bold text-center flex-1">
          {stage === "select" ? "글조각 쓰기" : selectedEventName}
        </h1>
        <Button onClick={handleNext} disabled={loading}>
          {stage === "select" ? "다음" : "저장"}
        </Button>
      </div>

      {stage === "select" ? (
        <>
          <SelectEvent events={events} selected={selected} onSelect={setSelected} />
          <AddEvent onEventAdded={handleEventAdded} />
        </>
      ) : (
        <StoryEditor
          title={title}
          content={content}
          onTitleChange={setTitle}
          onContentChange={setContent}
        />
      )}
    </div>
  );
}
