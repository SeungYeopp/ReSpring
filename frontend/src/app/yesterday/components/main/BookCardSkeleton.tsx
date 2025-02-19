export function BookCardSkeleton() {
    return (
      <div className="flex border border-gray-200 rounded-lg shadow-sm overflow-hidden h-[192px]">
        <div className="relative w-[128px] flex-shrink-0 bg-gray-200 animate-pulse" />
        <div className="flex-grow p-4 flex flex-col overflow-hidden">
          <div className="flex-grow flex flex-col h-2/3">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
            <div className="flex flex-wrap gap-1 overflow-hidden">
              {[1, 2, 3].map((index) => (
                <div key={index} className="bg-gray-200 h-6 w-16 rounded-full animate-pulse" />
              ))}
            </div>
          </div>
          <div className="h-1/3 flex flex-col justify-end">
            <div className="flex items-center mb-2">
              <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
              <div className="ml-2 h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex justify-between">
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  