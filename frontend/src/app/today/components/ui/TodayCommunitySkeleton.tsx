// components/TodayCommunitySkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function TodayCommunitySkeleton() {
  return (
    <div className="space-y-4">
      {/* 탭 스켈레톤 */}
      <div className="grid w-full grid-cols-3 gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10" />
        ))}
      </div>

      {/* 포스트 그리드 스켈레톤 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} className="h-full border-none shadow-sm">
            <CardContent className="p-4 flex flex-col h-full space-y-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-6 w-16 rounded-lg" />
              </div>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-32 w-full rounded-lg" /> {/* 이미지 플레이스홀더 */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}