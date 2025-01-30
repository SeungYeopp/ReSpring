import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface GridChallengeCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  like: number;
  view: number;
  participants: number;
  tags: string[];
}

export function GridChallengeCard({ id, title, description, image, like, view, participants, tags }: GridChallengeCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/tomorrow/${id}`);
  };

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-white" onClick={handleClick}>
      <div className="relative w-full aspect-[4/3]">
        <Image src={image || "/placeholder.webp"} alt={title} fill className="object-cover" />
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 line-clamp-1">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">{description}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>좋아요 {like}</span>
          <span>조회수 {view}</span>
          <span>참여자 {participants}</span>
        </div>
      </div>
    </Card>
  );
}
