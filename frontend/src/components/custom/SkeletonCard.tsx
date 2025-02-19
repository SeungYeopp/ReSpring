// src/components/custom/SekletonCard.tsx


import { Card } from "@/components/ui/card";
import { CustomSkeleton } from "@/components/custom/Skeleton";

interface SkeletonCardProps {
  className?: string; //   외부에서 스타일 조정 가능하도록 추가
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* 이미지 영역 */}
      <CustomSkeleton height="140px" width="100%" rounded="lg" className="mb-2" />

      <div className="p-4">
        {/* 제목 */}
        <CustomSkeleton height="16px" width="70%" className="mb-2" />

        {/* 설명 */}
        <CustomSkeleton height="14px" width="50%" />
      </div>
    </Card>
  );
}
