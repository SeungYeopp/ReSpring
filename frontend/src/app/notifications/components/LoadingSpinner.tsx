import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-20">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );
};

export default LoadingSpinner;
