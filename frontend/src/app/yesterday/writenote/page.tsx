"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/api";
import { makeStory } from "@/lib/api/story";  
import SelectNote from "../components/SelectNote";
import NoteEditor from "../components/NoteEditor";
import AddEvent from "@/components/custom/AddEvent";

export default function WriteNotePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);
  const [selectedEventName, setSelectedEventName] = useState<string>("");
  const [events, setEvents] = useState<
    { id: number; eventName: string; occurredAt: string; category: string; display: boolean }[]
  >([]);
  const [stage, setStage] = useState<"select" | "editor">("select");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const userId = "b3470d7d-ab19-4514-9abe-9c3ffaf0a616";

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

  const handleNext = async () => {
    if (selected !== null) {
      const event = events.find((event) => event.id === selected);
      if (event) {
        setSelectedEventName(event.eventName);
      }
    }

    if (stage === "editor") {
      setLoading(true);
      try {
        const storyId = await makeStory(userId, title, content, selected!, []);
        router.push(`/stories/${storyId}`);
      } catch (error) {
        console.error("Error creating story:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setStage("editor");
    }
  };

  const handleBack = () => {
    if (stage === "editor") {
      setStage("select");
    } else {
      router.back();
    }
  };

  const handleEventAdded = () => {
    fetchEvents();
  };

  return (
    <div className="relative p-6">
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
          <SelectNote events={events} selected={selected} onSelect={setSelected} />
          <AddEvent onEventAdded={handleEventAdded} />
        </>
      ) : (
        <NoteEditor
          title={title}
          content={content}
          onTitleChange={setTitle}
          onContentChange={setContent}
        />
      )}
    </div>
  );
}