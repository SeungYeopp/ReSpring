"use client";

import React, { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { BookCard } from "./BookCard";
import { cn } from "@/lib/utils";
import type { BookCarouselProps, CarouselIndicatorProps } from "../../types/maintypes";

// interface BookCarouselProps {
//   title: string
//   books: Book[]
// }

// interface CarouselIndicatorProps {
//   index: number
//   isActive: boolean
//   onClick: () => void
// }

export function MainBookCarousel({ title, books }: BookCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!books || books.length === 0) {
    return <div className="mb-8">책 정보가 없습니다.</div>;
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2 text-spring-olive">{title}</h3>
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {books.map((book) => (
            <CarouselItem key={book.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
              <BookCard book={book} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-4">
          {books.map((_, index) => (
            <CarouselIndicator key={index} index={index} isActive={index === current} onClick={() => api?.scrollTo(index)} />
          ))}
        </div>
      </Carousel>
    </div>
  );
}

function CarouselIndicator({ index, isActive, onClick }: CarouselIndicatorProps) {
  return <button className={cn("w-2 h-2 rounded-full mx-1 transition-all duration-300", isActive ? "bg-spring-forest" : "bg-gray-300")} onClick={onClick} />;
}
