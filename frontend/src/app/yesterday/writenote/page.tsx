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
import { useAuth } from "@/hooks/useAuth";

export default function WriteStoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userNickname } = useAuth(true);

  const [selected, setSelected] = useState<number | null>(null);
  const [selectedEventName, setSelectedEventName] = useState<string>("");
  // 새로 추가한 이미지 파일들
  const [newImages, setNewImages] = useState<File[]>([]);
  // 서버에 이미 있는 기존 이미지 URL들
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  // 삭제 요청할 기존 이미지의 S3 Key(또는 ID) 목록
  const [deleteImageIds, setDeleteImageIds] = useState<string[]>([]);

  const [events, setEvents] = useState<
    {
      id: number;
      eventName: string;
      occurredAt: string;
      category: string;
      display: boolean;
    }[]
  >([]);
  const [stage, setStage] = useState<"select" | "editor">("select");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [eventId, setEventId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [story, setStory] = useState<{ title: string; content: string } | null>(
    null
  );
  const [images, setImages] = useState<File[]>([]);

  const storyId = searchParams?.get("storyId")
    ? Number(searchParams.get("storyId"))
    : null;
  const source = searchParams?.get("source");

  const fetchEvents = async () => {
    try {
      const fetchedEvents = await getAllEvents();
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
    if (userNickname) {
      fetchEvents();
    }
  }, [userNickname]);

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
      const fetchedStory = await getStoryById(storyId);
      setStory(fetchedStory);
      setTitle(fetchedStory.title);
      setContent(fetchedStory.content);
      setEventId(fetchedStory.eventId);
      // 기존 이미지 URL 배열 (없을 경우 빈 배열)
      setExistingImageUrls(fetchedStory.images || []);
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
      if (storyId) {
        await updateStory(
          storyId,
          title,
          content,
          eventId!,
          deleteImageIds,
          newImages
        );
        if (source === "booklist") {
          router.push(`/profile/booklist/${userNickname}?tab=stories`);
        } else {
          router.push("/yesterday/create-book");
        }
      } else {
        if (stage === "select") {
          setStage("editor");
        } else {
          const newStoryId = await makeStory(
            title,
            content,
            selected!,
            newImages
          );
          router.push(`/yesterday/create-book`);
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
      if (source === "booklist") {
        router.push(`/profile/booklist/${userNickname}?tab=stories`);
      } else {
        setStage("select");
      }
    } else {
      if (source === "booklist2") {
        router.push(`/profile/booklist/${userNickname}?tab=stories`);
      }
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
        <Button
          onClick={handleNext}
          disabled={loading || (stage === "select" && selected === null)}
          className={`bg-brand text-white border border-brand rounded-md py-2 px-4 transition-all duration-300 ease-in-out
            ${
              loading || (stage === "select" && selected === null)
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-brand-dark hover:border-brand-dark focus:ring-2 focus:ring-brand-light focus:outline-none"
            }`}
        >
          {stage === "select" ? "다음" : "저장"}
        </Button>
      </div>

      {stage === "select" ? (
        <>
          <SelectEvent
            events={events}
            selected={selected}
            onSelect={setSelected}
          />
          <AddEvent onEventAdded={handleEventAdded} />
        </>
      ) : (
        <StoryEditor
          title={title}
          content={content}
          onTitleChange={setTitle}
          onContentChange={setContent}
          // 새로 추가할 이미지 파일들
          newImages={newImages}
          onNewImagesChange={setNewImages}
          // 기존(서버에 이미 있는) 이미지 URL들
          existingImageUrls={existingImageUrls}
          onExistingImageUrlsChange={setExistingImageUrls}
          // 사용자가 기존 이미지 삭제 시, 삭제할 S3 Key 목록 업데이트
          onDeleteImageIdsChange={setDeleteImageIds}
        />
      )}
    </div>
  );
}
