import { popularPosts, posts } from "./mocks/posts"
import PopularPosts from "./components/popular-posts"
import FollowedPosts from "./components/followed-posts"
import CommunityPosts from "./components/community-posts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TodayPage() {
  return (
    <div className="h-full flex flex-col space-y-4 p-4 overflow-y-auto">
      <Card className="flex-[1_0_25%]">
        <CardHeader>
          <CardTitle>인기글</CardTitle>
        </CardHeader>
        <CardContent>
          <PopularPosts posts={popularPosts.slice(0, 5)} />
        </CardContent>
      </Card>

      <Card className="flex-[1_0_25%]">
        <CardHeader>
          <CardTitle>팔로우한 사람의 글</CardTitle>
        </CardHeader>
        <CardContent>
          <FollowedPosts posts={posts.slice(0, 1)} />
        </CardContent>
      </Card>

      <Card className="flex-[1_0_50%]">
        <CardHeader>
          <CardTitle>생각 나누기</CardTitle>
        </CardHeader>
        <CardContent>
          <CommunityPosts posts={posts.slice(0, 2)} />
        </CardContent>
      </Card>
    </div>
  )
}

