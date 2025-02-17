import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { type Theme, themeColors } from "../../types/theme";

// 기존 인터페이스에 새 prop 'isActive'를 추가합니다.
// isActive: 오늘이 챌린지 기간(시작일~종료일) 내에 있는지 여부를 나타냅니다.
interface ChallengeActionButtonProps {
  isParticipating: boolean;
  isTodayCompleted: boolean;
  theme: Theme;
  onComplete: () => void;
  onJoin: () => void;
  isOwner?: boolean;
  isActive: boolean;
}

export function ChallengeActionButton({
  isParticipating,
  isTodayCompleted,
  theme,
  onComplete,
  onJoin,
  isOwner = false,
  isActive,
}: ChallengeActionButtonProps) {
  // 만약 사용자가 이미 챌린지에 참여 중이라면...
  if (isParticipating) {
    // 만약 오늘의 도전이 이미 완료되었다면 완료 메시지를 보여줍니다.
    if (isTodayCompleted) {
      return (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg" role="alert">
          <p className="font-bold">오늘의 도전 성공!</p>
          <p>오늘도 도전에 성공하셨네요. 내일도 힘내세요!</p>
        </div>
      );
    } else {
      // **추가된 조건**: 오늘이 챌린지 기간에 속하지 않는다면 '오늘의 도전 완료하기' 버튼을 렌더링하지 않습니다.
      if (!isActive) return null;
      // 오늘의 도전이 아직 완료되지 않았고, 오늘이 챌린지 기간 내라면 버튼을 표시합니다.
      return (
        <Button
          className={`w-full ${themeColors[theme].primary} hover:${themeColors[theme].primary} text-white h-12 text-lg`}
          onClick={onComplete}
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          오늘의 도전 완료하기
        </Button>
      );
    }
  } else {
    // 사용자가 아직 챌린지에 참여하지 않았다면...
    // 만약 현재 사용자가 챌린지 소유자라면(즉, 소유자는 당연히 참여 중이므로) 참여하기 버튼을 렌더링하지 않습니다.
    if (isOwner) return null;
    // 소유자가 아니면서 참여하지 않은 경우에는 '참여하기' 버튼을 보여줍니다.
    return (
      <Button
        className={`w-full ${themeColors[theme].primary} hover:${themeColors[theme].primary} text-white h-12 text-lg`}
        onClick={onJoin}
      >
        참여하기
      </Button>
    );
  }
}
