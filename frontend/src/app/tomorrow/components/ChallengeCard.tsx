import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ChallengeCardProps {
  title: string;
  description: string;
  tags: string[];
  image: string;
  userName?: string;
  progress?: string; // 추가된 prop
}

export function ChallengeCard({
  title,
  description,
  tags = [],
  image = "/placeholder.webp",
  userName,
  progress, // 추가된 prop
}: ChallengeCardProps) {
  return (
    <div className="bg-[#F2F2F2] rounded-xl overflow-hidden">
      <div className="flex p-4">
        <div className="w-1/3">
          <Image src={image || "/placeholder.webp"} alt={title} width={120} height={120} className="rounded-lg w-full h-[120px] object-cover" />
        </div>
        <div className="w-2/3 pl-4 flex flex-col justify-between">
          {userName && (
            <div className="mb-2">
              <span className="text-sm text-gray-600">{userName}</span>
            </div>
          )}
          <div>
            <div className="flex items-center mb-2">
              <span className="text-lg font-bold">{title}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{description}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-white rounded-full text-xs text-gray-600">
                  {tag}
                </span>
              ))}
            </div>
            {progress && <p className="text-sm text-gray-600 mb-2">{progress}</p>}
          </div>
          <div className="flex justify-end">
            <Button className="bg-[#5F9D55] hover:bg-[#4C7C43] text-white">이어하기</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
