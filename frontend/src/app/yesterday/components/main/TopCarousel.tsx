"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { BookOpen, Clock } from "lucide-react";
import type {CarouselIndicatorProps } from "../../types/maintypes";

import {getTopThreeWeeklyBooks, getAllBooksByUserId, BookFull, Book} from "@/lib/api"
import {getAllSubscribers} from "@/lib/api/subscribe"
import { useRouter } from "next/navigation";

export default function TopCarousel() {
  const [activeTab, setActiveTab] = useState("weekly");
  const [weeklyBooks, setWeeklyBooks] = useState<Book[]>([]);
  const [subscriberBooks, setSubscriberBooks] = useState<Book[]>([]);

  useEffect(() => {
    const handleInitials = async () => {
      try{
        const weeklyResult = await getTopThreeWeeklyBooks();
        setWeeklyBooks(weeklyResult);

        const subscribersResult = await getAllSubscribers();
        const subscriberNicknames = subscribersResult.map((subbedUser) => subbedUser.userNickname);
        const randomSubscribers = getRandomSubscribers(subscriberNicknames, 1); // 구독한 사람 랜덤 한 명 뽑기.

        const subscriberBooks = await getAllBooksByUserId(randomSubscribers[0]);

        setSubscriberBooks(subscriberBooks);
      }catch(error){
        console.error(error);
      }
    }
    handleInitials();
  }, [])

  const getRandomSubscribers = (ids : string[], count : number) => {
    if (ids.length <= count) {
      return ids;
    }
  
    const shuffled = [...ids]; // 배열을 복사한 뒤
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // 요소를 랜덤하게 섞기
    }
  
    return shuffled.slice(0, count);
  };

  return (
    <Tabs defaultValue="weekly" onValueChange={(value) => setActiveTab(value)} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="weekly" className="flex items-center justify-center">
          <BookOpen className="mr-2 h-4 w-4" />
          주간의 서
        </TabsTrigger>
        <TabsTrigger value="latest" className="flex items-center justify-center">
          <Clock className="mr-2 h-4 w-4" />
          구독
        </TabsTrigger>
      </TabsList>
      <TabsContent value="weekly">
        <BookCarousel books={weeklyBooks} />
      </TabsContent>
      <TabsContent value="latest">
        <BookCarousel books={subscriberBooks} />
      </TabsContent>
    </Tabs>
  );
}

interface BookCarouselProps {
  books: Book[];
}

function BookCarousel({ books }: BookCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const router = useRouter();
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

  const handleOnClickBook = (bookId : number) => {
    router.push(`/yesterday/newbook/${bookId}`)
  }

  return (
    <Carousel className="w-full" setApi={setApi}>
      <CarouselContent>
        {books.map((book) => (
          <CarouselItem key={book.id} className="md:basis-1/2 lg:basis-1/1">
            <Card className="bg-[#f3f8e9] rounded-2xl">
              <CardContent className="flex p-6 gap-6">
                {/* 왼쪽: 책 표지 */}
                <div className="w-1/3 aspect-[3/4] flex-shrink-0">
                  <img
                    src={book.coverImage}
                    alt={book.coverImage}
                    className="w-full h-full object-cover rounded-lg shadow-md cursor-pointer"
                    onClick={() => handleOnClickBook(book.id)}

                  />
                </div>
                {/* 오른쪽: 텍스트 콘텐츠 */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-800">{book.title}</h3>
                    {/* 태그 표시 */}
                    <div className="flex flex-wrap gap-2">
                      {book.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-tag-lightgreen font-semibold text-tag-darkgreen px-3 py-1 text-sm rounded-full shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={book.authorProfileImage} />
                      <AvatarFallback className="bg-spring-olive">{book.authorNickname}</AvatarFallback>
                    </Avatar>
                    <span className="text-gray-700 font-medium">{book.authorNickname}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* 점 인디케이터 (최대 5개까지만 표시) */}
      <div className="flex justify-center mt-4">
        {" "}
        {/* mt-6에서 mt-4로 변경 */}
        {books.slice(0, 5).map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full mx-1 ${current === index ? "bg-blue-500" : "bg-gray-300"}`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`슬라이드 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </Carousel>

  );
}

function CarouselIndicator({ index, isActive, onClick }: CarouselIndicatorProps) {
  return <button className={cn("w-2 h-2 rounded-full mx-1 transition-all duration-300", isActive ? "bg-spring-forest" : "bg-gray-300")} onClick={onClick} />;
}
