import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Users } from "lucide-react"; // ✅ Lucide 아이콘 추가

interface GridChallengeCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  like: number;
  participants: number;
  tags: string[];
  status: "UPCOMING" | "ONGOING" | "ENDED"; // ✅ 챌린지 상태 추가
}

export function GridChallengeCard({
  id,
  title,
  description,
  image,
  like,
  participants,
  tags,
  status, // ✅ 상태 추가
}: GridChallengeCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/tomorrow/${id}`);
  };

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-white relative" onClick={handleClick}>
      {/* ✅ 챌린지 상태 뱃지 */}
      <div
        className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded ${
          status === "ONGOING"
            ? "bg-green-100 text-green-700"
            : status === "UPCOMING"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        {status === "ONGOING" ? "진행 중" : status === "UPCOMING" ? "예정" : "종료됨"}
      </div>

      <div className="relative w-full aspect-[4/3]">
        <Image src={image || "/placeholder.webp"} alt={title} fill className="object-cover" />
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 line-clamp-1">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">{description}</p>

        {/* ✅ 태그 표시 */}
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
              {tag}
            </span>
          ))}
        </div>

        {/* ✅ 좋아요 & 참여자 수 (아이콘 적용) */}
        <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span>{like}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-blue-500" />
            <span>{participants}</span>
          </div>
        </div>

        {/* ✅ 챌린지 상태에 따른 버튼 추가 */}
        <div className="mt-3">
          {status === "ONGOING" ? (
            <Button className="w-full bg-green-500 hover:bg-green-700 text-white">이어하기</Button>
          ) : status === "UPCOMING" ? (
            <Button className="w-full bg-blue-500 hover:bg-blue-700 text-white">참여하기</Button>
          ) : (
            <Button disabled className="w-full bg-gray-400 text-white">종료됨</Button>
          )}
        </div>
      </div>
    </Card>
  );
}
