"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { getAllStories, deleteStory } from "@/lib/api/story";
import { getAllEvents } from "@/lib/api/event";
import type { Story } from "@/lib/api/story";
import Link from "next/link";
import { Plus, Edit, Trash2, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface Event {
  id: number;
  eventName: string;
}

interface StoryShelfProps {
  userNickname: string;
}

const StoryShelf: React.FC<StoryShelfProps> = ({ userNickname }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleDelete = async (storyId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteStory(storyId);
      setStories((prevStories) => prevStories.filter((story) => story.id !== storyId));
      setIsDialogOpen(false); // 모달 닫기
      setSelectedStory(null); // 선택된 스토리 초기화
    } catch (error) {
      console.error("Error deleting story:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const fetchStoriesAndEvents = async () => {
      try {
        const [fetchedStories, fetchedEvents] = await Promise.all([getAllStories(), getAllEvents()]);
        setStories(fetchedStories);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStoriesAndEvents();
  }, []);

  const getEventName = (eventId: number) => {
    const event = events.find((e) => e.id === eventId);
    return event ? event.eventName : "Unknown Event";
  };

  return (
    <div className="min-h-screen">
      <div ref={containerRef} className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Link href="/yesterday/writenote?source=booklist2">
            <Card className="h-[280px] group hover:shadow-lg transition-all duration-300 
                            bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-700 
                            border border-gray-200/50 dark:border-gray-700/50">
              <CardContent className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Plus className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">새로운 글 작성하기</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {stories.map((story, index) => (
            <Card
              key={story.id}
              className="h-[280px] group hover:shadow-lg transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
              onClick={() => {
                setSelectedStory(story);
                setIsDialogOpen(true);
              }}
            >
              <CardContent className="p-0">
                {/* 🔹 ShadCN Carousel 적용 (이미지 있을 때만 렌더링) */}
                {story.images.length > 0 && (
                  <Carousel className="relative w-full">
                    <CarouselContent>
                      {story.images.map((image, i) => (
                        <CarouselItem key={i}>
                          <img
                            src={image}
                            alt={`story-${story.id}-img-${i}`}
                            className="w-full h-40 object-cover rounded-t-lg"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                )}
              </CardContent>
              <CardHeader className="p-4">
                <h3 className="font-semibold text-lg line-clamp-1">{story.title}</h3>
                


                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                  <Tag className="w-3 h-3" />
                  <span>{getEventName(story.eventId)}</span>
                  <span> · {new Date(story.occurredAt).toLocaleDateString()}</span>
                </div>
                  {/* 미리보기 추가 */}
                  <p className="text-xs text-gray-400 dark:text-gray-100 line-clamp-1 mt-3 pt-3">
                    {story.content ? story.content : "미리보기 없음"}
                  </p>
              </CardHeader>


            </Card>
          ))}
        </div>
      </div>

      {/* 🔹 다이얼로그 내에서도 캐러셀 추가 & 편집/삭제 버튼 추가 */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedStory(null); // 모달 닫힐 때 초기화
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          {selectedStory && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedStory.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 text-sm">
                  <Tag className="w-3 h-3" />
                  {getEventName(selectedStory.eventId)}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                {selectedStory.images.length > 0 && (
                  <Carousel className="relative w-full">
                    <CarouselContent>
                      {selectedStory.images.map((image, i) => (
                        <CarouselItem key={i}>
                          <img
                            src={image}
                            alt={`story-detail-img-${i}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                )}

                <p className="text-sm text-gray-600 dark:text-gray-300">{selectedStory.content}</p>

                {/* 🔹 편집 & 삭제 버튼 추가 */}
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(selectedStory.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/yesterday/writenote?storyId=${selectedStory.id}&source=booklist`}>
                        <Edit className="w-4 h-4 mr-1" />
                        편집
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(selectedStory.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      삭제
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoryShelf;
