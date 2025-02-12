import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonUI() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Section */}
      <div className="relative min-h-[80vh] bg-gradient-to-b from-gray-900 to-background">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center px-4 pt-20">
          {/* Book Cover */}
          <Skeleton className="w-[240px] h-[360px] rounded-lg" />
          {/* Title */}
          <Skeleton className="h-8 w-3/4 max-w-[300px] mt-6" />
          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
          {/* Author and Stats */}
          <div className="flex items-center gap-4 mt-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-4 py-6">
        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
        {/* Content */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    </div>
  )
}

