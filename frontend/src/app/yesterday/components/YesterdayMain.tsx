
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/custom/TabGreen"
import TodaysBook from "@/app/yesterday/components/TodaysBook"

  

export const YesterdayMain = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <Tabs defaultValue="today" className="flex flex-col items-center justify-center">
                <TabsList>
                    <TabsTrigger value="today">오늘의 서</TabsTrigger>
                    <TabsTrigger value="subscribe">구독</TabsTrigger>
                </TabsList>
                <TabsContent value="today">
                    <TodaysBook />
                </TabsContent>
                <TabsContent value="subscribe">구독</TabsContent>
            </Tabs>
        </div>
    )
}