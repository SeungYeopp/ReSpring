import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ChallengeCardProps {
  title: string;
  description: string;
  tags: string[];
  image: string;
  ownerName?: string; // ✅ API 변경 사항 반영 (userName → ownerName)
  currentStreak?: number; // ✅ 연속 성공일 표시 (참여한 챌린지의 경우)
  participantCount?: number; // ✅ 참가자 수 표시
  status?: "UPCOMING" | "ONGOING" | "ENDED"; // ✅ 챌린지 상태 추가
}

export function ChallengeCard({
  title,
  description,
  tags = [],
  image = "/placeholder.webp",
  ownerName,
  currentStreak,
  participantCount,
  status,
}: ChallengeCardProps) {
  return (
    <div className="bg-[#F2F2F2] rounded-xl overflow-hidden shadow-md">
      <div className="flex p-4">
        {/* 챌린지 이미지 */}
        <div className="w-1/3">
          <Image
            src={image || "/placeholder.webp"}
            alt={title}
            width={120}
            height={120}
            className="rounded-lg w-full h-[120px] object-cover"
          />
        </div>

        {/* 챌린지 정보 */}
        <div className="w-2/3 pl-4 flex flex-col justify-between">
          {/* 챌린지 소유자 (구독한 사람의 챌린지일 경우) */}
          {ownerName && (
            <div className="mb-2">
              <span className="text-sm text-gray-600">{ownerName}님의 도전</span>
            </div>
          )}

          {/* 챌린지 제목 & 설명 */}
          <div>
            <div className="flex items-center mb-2">
              <span className="text-lg font-bold">{title}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{description}</p>

            {/* 태그 리스트 */}
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-white rounded-full text-xs text-gray-600">
                  {tag}
                </span>
              ))}
            </div>

            {/* 연속 성공일 or 참가자 수 표시 */}
            {currentStreak !== undefined && (
              <p className="text-sm text-gray-600 mb-2">연속 성공일: {currentStreak}일</p>
            )}
            {participantCount !== undefined && (
              <p className="text-sm text-gray-600 mb-2">참가자: {participantCount}명</p>
            )}
          </div>

          {/* 상태 및 버튼 */}
          <div className="flex justify-between items-center">
            {/* 챌린지 상태 표시 */}
            <span
              className={`text-xs font-semibold px-2 py-1 rounded ${
                status === "ONGOING"
                  ? "bg-green-100 text-green-700"
                  : status === "UPCOMING"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {status === "ONGOING" ? "진행 중" : status === "UPCOMING" ? "예정" : "종료됨"}
            </span>

            {/* 버튼 (ONGOING 상태일 때만 활성화) */}
            {status === "ONGOING" ? (
              <Button className="bg-[#5F9D55] hover:bg-[#4C7C43] text-white">이어하기</Button>
            ) : (
              <Button disabled className="bg-gray-400 text-white">종료됨</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
