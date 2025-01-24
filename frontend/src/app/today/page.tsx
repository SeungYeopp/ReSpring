import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PopularPosts from "./components/popular-posts"
import FollowedPosts from "./components/followed-posts"
import AllPosts from "./components/all-posts"

export default function TodayPage() {
  return (
    <main>
      {/* 인기글 섹션 */}
      <section className="px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">인기글</h2>
        <PopularPosts />
      </section>

      {/* 팔로우한 사람의 글 섹션 */}
      <section className="px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">팔로우한 사람의 글</h2>
        <FollowedPosts />
      </section>

      {/* 생각 나누기 탭 섹션 */}
      <section className="px-4 py-6">
        <Tabs defaultValue="all">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="concerns">고민/질문</TabsTrigger>
            <TabsTrigger value="info">정보 공유</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <AllPosts filter="all" />
          </TabsContent>
          <TabsContent value="concerns">
            <AllPosts filter="concerns" />
          </TabsContent>
          <TabsContent value="info">
            <AllPosts filter="info" />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}

