"use client";

import LoadingIndicator from "@/components/custom/loading/LoadingIndicator";
const LoadingResponsivePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* 화면 크기에 따라 다른 로딩 애니메이션을 표시 */}
      <LoadingIndicator />
    </div>
  );
};

export default LoadingResponsivePage;
