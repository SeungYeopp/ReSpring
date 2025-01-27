import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/custom/TabGreen"

  

export const YesterdayMain = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <Tabs defaultValue="today">
            <TabsList>
                <TabsTrigger value="today">오늘의 서</TabsTrigger>
                <TabsTrigger value="subscribe">구독</TabsTrigger>
            </TabsList>
            <TabsContent value="today">오늘의 서</TabsContent>
            <TabsContent value="subscribe">구독</TabsContent>
            </Tabs>
            {/* <Carousel className="w-full max-w-xs"
              opts={{
                align: "start",
                loop: true,
              }}>
                <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                        <Card className="border-brand">
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                <span className="text-4xl font-semibold">{index + 1}</span>
                            </CardContent>
                        </Card>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel> */}
        </div>
    )
}