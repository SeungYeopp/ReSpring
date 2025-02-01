import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SliderChallengeCardProps {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image: string;
}

export function SliderChallengeCard({ id, title, description, tags = [], image = "/placeholder.webp" }: SliderChallengeCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/tomorrow/${id}`);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden w-full shadow-sm hover:shadow-md transition-shadow duration-300" onClick={handleClick}>
      <div className="flex p-3 sm:p-4">
        <div className="w-[100px] sm:w-[120px] mr-3 sm:mr-4">
          <div className="relative w-full aspect-square">
            <Image src={image || "/placeholder.svg"} alt={title} fill className="rounded-xl object-cover" />
          </div>
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="mb-2 sm:mb-3">
            <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 line-clamp-1">{title}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">{description}</p>
          </div>
          <div className="flex items-center justify-between gap-2 sm:gap-4 mt-auto">
            <div className="flex gap-1 sm:gap-2 min-w-0 flex-shrink overflow-hidden">
              {tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-100 rounded-full text-xs text-gray-600 whitespace-nowrap">
                  {tag}
                </span>
              ))}
            </div>
            <Button variant="default" className="bg-[#96b23c] hover:bg-[#638d3e] text-white px-2 sm:px-3 py-1 sm:py-1.5 h-auto rounded-full text-xs sm:text-sm font-medium shadow-sm flex-shrink-0">
              이어하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
