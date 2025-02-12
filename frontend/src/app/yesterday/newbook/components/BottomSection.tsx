"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TableOfContents from "./TableOfContents"
import Recommendations from "./Recommendations"
import Comments from "./Comments"

export default function BottomSection({ bookId }: { bookId: string }) {
  const [activeTab, setActiveTab] = useState("toc")

  return (
    <section className="pb-20">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start h-12 bg-transparent border-b border-border rounded-none p-0">
          <TabsTrigger
            value="toc"
            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            목차
          </TabsTrigger>
          <TabsTrigger
            value="recommendations"
            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            추천
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            댓글
          </TabsTrigger>
        </TabsList>
        <TabsContent value="toc" className="p-4">
          <TableOfContents bookId={bookId} />
        </TabsContent>
        <TabsContent value="recommendations" className="p-4">
          <Recommendations bookId={bookId} />
        </TabsContent>
        <TabsContent value="comments" className="p-4">
          <Comments bookId={bookId} />
        </TabsContent>
      </Tabs>
    </section>
  )
}

