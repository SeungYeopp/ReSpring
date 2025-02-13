import { Skeleton } from "@/components/ui/skeleton"
import { AspectRatio } from "@/components/ui/aspect-ratio"



export function TopSectionSkeleton() {
  return (
    <section className="relative min-h-[80vh] text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="relative z-10 flex justify-between p-4">
        <div className="flex space-x-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
      <div className="relative z-10 flex flex-col items-center px-4 pt-20">
        <div className="w-[240px]">
          <AspectRatio ratio={156 / 234}>
            <Skeleton className="w-full h-full rounded-lg" />
          </AspectRatio>
        </div>
        <Skeleton className="h-8 w-3/4 max-w-[300px] mt-6 mb-4" />
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-20 h-6 rounded-full" />
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="w-24 h-6" />
          <Skeleton className="w-16 h-6" />
          <Skeleton className="w-16 h-6" />
        </div>
      </div>
    </section>
  )
}

