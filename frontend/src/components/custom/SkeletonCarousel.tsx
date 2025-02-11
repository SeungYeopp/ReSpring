import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCarousel() {
  return (
    <div className="relative">
      <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2 sm:pb-4">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="flex-shrink-0 w-full md:basis-1/2 lg:basis-1/3">
            <CardContent className="p-2 sm:p-3">
              <Skeleton className="h-20 sm:h-28 w-full mb-2 sm:mb-3 rounded-lg" />
              <Skeleton className="h-3 sm:h-4 w-3/4 mb-1 sm:mb-2" />
              <div className="flex items-center gap-1 sm:gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-2 w-2 sm:h-3 sm:w-3 rounded-full" />
                  <Skeleton className="h-2 sm:h-3 w-12 sm:w-16" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-2 w-2 sm:h-3 sm:w-3 rounded-full" />
                  <Skeleton className="h-2 sm:h-3 w-10 sm:w-14" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="absolute top-1/2 left-0 sm:left-1 transform -translate-y-1/2 h-4 w-4 sm:h-6 sm:w-6 rounded-full" />
      <Skeleton className="absolute top-1/2 right-0 sm:right-1 transform -translate-y-1/2 h-4 w-4 sm:h-6 sm:w-6 rounded-full" />
      
      {/* 점 인디케이터 */}
      <div className="flex justify-center mt-1 sm:mt-2">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <Skeleton key={index} className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full mx-0.5 sm:mx-1" />
        ))}
      </div>
    </div>
  )
}