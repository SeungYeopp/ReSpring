import { Skeleton } from "@/components/ui/skeleton"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export function RecommendationsSkeleton() {
  return (
    <div className="space-y-8 mt-8">
      {[1, 2].map((section) => (
        <div key={section} className="space-y-4">
          <Skeleton className="h-6 w-48 mx-4" />
          <div className="flex space-x-3 overflow-x-auto px-4 pb-4">
            {[1, 2, 3, 4].map((book) => (
              <div key={book} className="flex-shrink-0 w-[calc((100vw-32px)/3)] max-w-[200px] min-w-[120px] space-y-2">
                <AspectRatio ratio={156 / 234}>
                  <Skeleton className="w-full h-full rounded-lg" />
                </AspectRatio>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

