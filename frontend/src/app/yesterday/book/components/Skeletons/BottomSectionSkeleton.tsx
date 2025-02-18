import { Skeleton } from "@/components/ui/skeleton"
import { TableOfContentsSkeleton } from "./TableOfContentsSkeleton"
import { RecommendationsSkeleton } from "./RecommendationsSkeleton"
import { CommentsSkeleton } from "./CommentsSkeleton"

export function BottomSectionSkeleton() {
  return (
    <section className="pb-20">
      <div className="flex space-x-0 mb-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 flex-1 rounded-none" />
        ))}
      </div>
      <div className="p-4">
        <TableOfContentsSkeleton />
        <RecommendationsSkeleton />
        <CommentsSkeleton />
      </div>
    </section>
  )
}

