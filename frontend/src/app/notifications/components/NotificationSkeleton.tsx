import type React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const NotificationSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="p-4 rounded-lg shadow-sm bg-white">
          <div className="flex items-start space-x-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-grow space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-between items-center mt-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSkeleton;
