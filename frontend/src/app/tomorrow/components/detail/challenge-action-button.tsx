import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { type Theme, themeColors } from "@/types/theme";

interface ChallengeActionButtonProps {
  isParticipating: boolean;
  isTodayCompleted: boolean;
  theme: Theme;
  onComplete: () => void;
  onJoin: () => void;
}

export function ChallengeActionButton({ isParticipating, isTodayCompleted, theme, onComplete, onJoin }: ChallengeActionButtonProps) {
  if (isParticipating) {
    if (isTodayCompleted) {
      return (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg" role="alert">
          <p className="font-bold">오늘의 도전 성공!</p>
          <p>오늘도 도전에 성공하셨네요. 내일도 힘내세요!</p>
        </div>
      );
    } else {
      return (
        <Button className={`w-full ${themeColors[theme].primary} hover:${themeColors[theme].primary} text-white h-12 text-lg`} onClick={onComplete}>
          <CheckCircle className="w-5 h-5 mr-2" />
          오늘의 도전 완료하기
        </Button>
      );
    }
  } else {
    return (
      <Button className={`w-full ${themeColors[theme].primary} hover:${themeColors[theme].primary} text-white h-12 text-lg`} onClick={onJoin}>
        참여하기
      </Button>
    );
  }
}
