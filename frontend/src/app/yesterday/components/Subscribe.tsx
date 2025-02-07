import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/app/yesterday/components/ui/BookCarouselCard"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/app/yesterday/components/ui/BookCarousel"
import {bookData, iBook} from "@/mocks/book/book-mockdata"
import Image from 'next/image'

export const Subscribe = () => {
    return(
        <div>
            <Carousel opts={{ align: "start", loop: true, }}>
                <CarouselContent>
                    {
                        // bookData는 이후 api에서 직접 가져온 데이터로 바뀌어야 합니다.
                        bookData.map(({title, content, cover_img, tag, like, view, created_at, updated_at} : iBook) => {
                            return (
                                <CarouselItem key={title}>
                                    <Card className="flex flex-row h-full w-full border-brand-light border-2">
                                        <div className="basis-3/7 flex justify-center items-center p-2">
                                            <Image src={cover_img} alt={`${title}_img`} width={100} height={160}/>
                                        </div>
                                        <CardContent className="basis-4/7 flex flex-col justify-center space-y-2">
                                            <CardTitle className="text-lg font-bold ">{title}</CardTitle>
                                            {/* 봄날의 서 설명을 최대 60자로 제한한다.*/}
                                            <CardDescription>{content.length > 30? content.slice(0, 30) + "...": content}</CardDescription>
                                            <p className="text-xs font-medium text-gray-500">저자: 김싸피</p>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            )
                        })
                    }
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default Subscribe