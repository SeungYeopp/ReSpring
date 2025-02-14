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
import { Button } from "@/components/ui/button";
import { getTopThreeWeeklyBooks, BookFull, Book, CompiledBook, Chapter} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth"

export const TodaysBook = () => {
    const [api, setApi] = useState<CarouselApi | null>(null);
    const [bookData, setBookData] = useState<Book[]>([]);
    const [current, setCurrent] = useState(0);

    const {userId} = useAuth(true);

    const onSelect = useCallback(() => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap());
    }, [api]);

    useEffect(() => {
        if(!userId)
            return
        const setInitials = async () => {
            try {
                const result: Book[] = await getTopThreeWeeklyBooks(userId);
    
                console.log(result);
                setBookData(result);
            } catch (error) {
                console.error(error);
            }
        };
    
        setInitials();
    }, [userId]);
    

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
            {/* bookData가 없을 때 메시지 표시 */}
            {bookData.length === 0 ? (
                <div className="text-center text-gray-500 mt-4">
                    <p>결과가 없습니다.</p>
                </div>
            ) : (
                <Carousel
                    opts={{ align: "start", loop: true }}
                    className="w-2/3"
                    setApi={setApi}
                >
                    <CarouselContent className="w-full">
                        {bookData.map(({ title, tags, coverImage }: Book, index) => (
                            <CarouselItem key={title} className="w-full lg:w-1/3 pl-4">
                                <Card className="flex flex-row h-full w-full border border-gray-200 shadow-md rounded-lg overflow-hidden">
                                    <div className="w-1/3 flex justify-center items-center p-4 bg-gray-100">
                                        <img 
                                            src={coverImage} 
                                            alt={`${title}_img`} 
                                            width={100} 
                                            height={160} 
                                            className="rounded-md object-cover aspect-[5/8] w-[100px] h-[160px]" 
                                            onError={(e) => (e.currentTarget.src = "/corgis/placeholder1.jpg")}
                                        />
                                    </div>
                                    <CardContent className="w-2/3 flex flex-col justify-center p-4 space-y-2">
                                        <CardTitle className="text-lg font-bold text-gray-900">
                                            {title || "봄날의 서 제목"}
                                        </CardTitle>

                                        {/* 태그들 보여주기 */}
                                        <div className="flex flex-wrap gap-2">
                                            {tags && tags.length > 0 ? (
                                                tags.map((tag, index) => (
                                                    <span 
                                                        key={index} 
                                                        className="text-xs font-medium text-white bg-brand-light px-3 py-1 rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs font-medium text-gray-500">태그 없음</span>
                                            )}
                                        </div>

                                        {/* 봄날의 서 보기 버튼 */}
                                        <Button variant="default" className="bg-[#96b23c] hover:bg-[#638d3e] text-white px-2 sm:px-3 py-1 sm:py-1.5 h-auto rounded-full text-xs sm:text-sm font-medium shadow-sm w-auto">
                                            봄날의 서 보기
                                        </Button>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            )}
            {/* 점 인디케이터 */}
            <div className="flex justify-center mt-4">
                {bookData.length > 0 && bookData.slice(0, 5).map((_, index) => (
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
