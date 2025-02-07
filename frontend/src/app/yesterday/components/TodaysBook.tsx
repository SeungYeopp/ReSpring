import { useEffect, useState, useCallback } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselApi
} from "@/components/ui/carousel";
import { bookData, iBook } from "@/mocks/book/book-mockdata";
import Image from "next/image";

export const TodaysBook = () => {
    const [api, setApi] = useState<CarouselApi | null>(null);
    const [current, setCurrent] = useState(0);

    const onSelect = useCallback(() => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap());
    }, [api]);

    useEffect(() => {
        if (!api) return;

        api.on("select", onSelect);

        const autoplayInterval = setInterval(() => {
            api.scrollNext();
        }, 5000);

        return () => {
            api.off("select", onSelect);
            clearInterval(autoplayInterval);
        };
    }, [api, onSelect]);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-screen-sm mx-auto">
            <Carousel
                opts={{ align: "start", loop: true }}
                className="w-2/3"
                setApi={setApi}
            >
                <CarouselContent className="w-full">
                    {bookData.map(({ title, content, cover_img }: iBook, index) => (
                        <CarouselItem key={title} className="w-full lg:w-1/3 pl-4">
                            <Card className="flex flex-row h-full w-full border border-gray-200 shadow-md rounded-lg overflow-hidden">
                                <div className="w-1/3 flex justify-center items-center p-4 bg-gray-100">
                                    <Image src={cover_img} alt={`${title}_img`} width={100} height={160} className="rounded-md" />
                                </div>
                                <CardContent className="w-2/3 flex flex-col justify-center p-4 space-y-2">
                                    <CardTitle className="text-lg font-bold text-gray-900">{title}</CardTitle>
                                    <CardDescription className="text-gray-600">
                                        {content.length > 30 ? content.slice(0, 30) + "..." : content}
                                    </CardDescription>
                                    <p className="text-xs font-medium text-gray-500">저자: 김싸피</p>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            {/* 점 인디케이터 */}
            <div className="flex justify-center mt-4">
                {bookData.slice(0, 5).map((_, index) => (
                    <button
                        key={index}
                        className={`h-2 w-2 rounded-full mx-1 ${current === index ? "bg-blue-500" : "bg-gray-300"}`}
                        onClick={() => api?.scrollTo(index)}
                        aria-label={`슬라이드 ${index + 1}로 이동`}
                    />
                ))}
            </div>
        </div>
    );
};

export default TodaysBook;
