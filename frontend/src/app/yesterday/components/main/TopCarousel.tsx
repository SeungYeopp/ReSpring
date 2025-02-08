"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { BookOpen, Clock } from "lucide-react";
import type { Book, CarouselIndicatorProps } from "../../types/maintypes";
import { weeklyBooks, latestBooks } from "@/app/yesterday/components/main/mocks/books";

export default function TopCarousel() {
  const [activeTab, setActiveTab] = useState("weekly");

  return (
    <Tabs defaultValue="weekly" onValueChange={(value) => setActiveTab(value)} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="weekly" className="flex items-center justify-center">
          <BookOpen className="mr-2 h-4 w-4" />
          주간의 서
        </TabsTrigger>
        <TabsTrigger value="latest" className="flex items-center justify-center">
          <Clock className="mr-2 h-4 w-4" />
          최신 서적
        </TabsTrigger>
      </TabsList>
      <TabsContent value="weekly">
        <BookCarousel books={weeklyBooks} />
      </TabsContent>
      <TabsContent value="latest">
        <BookCarousel books={latestBooks} />
      </TabsContent>
    </Tabs>
  );
}

interface BookCarouselProps {
  books: Book[];
}

// ✅ 랜덤 이미지 생성 함수
const getRandomImage = () => {
  const imageNumber = Math.floor(Math.random() * 9) + 1; // 1~9 숫자 랜덤 선택
  return `/corgis/placeholder${imageNumber}.jpg`; // public 폴더 내 이미지 경로
};

function BookCarousel({ books }: BookCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const scrollToNext = useCallback(() => {
    if (api) {
      api.scrollNext();
    }
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    const timer = setInterval(() => {
      scrollToNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [scrollToNext]);

  return (
    <Carousel className="w-full" setApi={setApi}>
      <CarouselContent>
        {books.map((book) => (
          <CarouselItem key={book.id} className="md:basis-1/2 lg:basis-1/1">
            <Card className="bg-[#f3f8e9] rounded-2xl">
              <CardContent className="flex p-6 gap-6">
                {/* 왼쪽: 책 표지 */}
                <div className="w-1/3 aspect-[3/4] flex-shrink-0">
                  <img src={book.coverImg || "/placeholder.svg"} alt={book.title} className="w-full h-full object-cover rounded-lg shadow-md" />
                </div>
                {/* 오른쪽: 텍스트 콘텐츠 */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-800">{book.title}</h3>
                    <p className="text-gray-600 line-clamp-3">{book.content}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Avatar className="h-8 w-8">
                      {/* 피그마에는 이미지가 있는뎅.... */}
                      <AvatarImage src={getRandomImage()} />
                      <AvatarFallback className="bg-spring-olive text-white">{book.nickname?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                    <span className="text-gray-700 font-medium">{book.nickname}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center mt-4">
        {books.map((_, index) => (
          <CarouselIndicator key={index} index={index} isActive={index === current} onClick={() => api?.scrollTo(index)} />
        ))}
      </div>
    </Carousel>
  );
}

function CarouselIndicator({ index, isActive, onClick }: CarouselIndicatorProps) {
  return <button className={cn("w-2 h-2 rounded-full mx-1 transition-all duration-300", isActive ? "bg-spring-forest" : "bg-gray-300")} onClick={onClick} />;
}
