// components/custom/SkeletonCarousel.tsx

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCarousel() {
  return (
    <div className="space-y-4">
      <Card className="shadow-none border-none">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-6 w-16 rounded-lg" />
          </div>
          <Skeleton className="h-5 w-3/4 mb-1" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex items-center gap-4 mt-2">
            <Skeleton className="h-4 w-12" />
          </div>
        </CardContent>
      </Card>
      
      {/* 페이지네이션 (점 UI) */}
      <div className="py-2 text-center">
        {[1, 2, 3].map((_, index) => (
          <Skeleton key={index} className="inline-block h-2 w-2 mx-1 rounded-full" />
        ))}
      </div>
    </div>
  )
}