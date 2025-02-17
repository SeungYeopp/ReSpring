"use client"

import { useState, Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TableOfContents from "./TableOfContents"
import Recommendations from "./Recommendations"
import Comments from "./Comments"
import { TableOfContentsSkeleton } from "./Skeletons/TableOfContentsSkeleton"
import { RecommendationsSkeleton } from "./Skeletons/RecommendationsSkeleton"
import { CommentsSkeleton } from "./Skeletons/CommentsSkeleton"
import {BookFull} from "@/lib/api"

export default function BottomSection({ book }: { book: BookFull }) {
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

        {/* 목차 탭 */}
        <TabsContent value="toc" className="p-4">
          <Suspense fallback={<TableOfContentsSkeleton />}>
            <TableOfContents bookId={book.id.toString()} />
          </Suspense>
        </TabsContent>

        {/* 추천 탭 */}
        <TabsContent value="recommendations" className="p-4">
          <Suspense fallback={<RecommendationsSkeleton />}>
            <Recommendations bookId={book.id.toString()} />
          </Suspense>
        </TabsContent>

        {/* 댓글 탭 */}
        <TabsContent value="comments" className="p-4">
          <Suspense fallback={<CommentsSkeleton />}>
            <Comments bookId={book.id} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </section>
  )
}
