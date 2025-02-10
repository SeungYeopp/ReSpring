import { CustomSkeleton } from "../ui/chat-custom-skeleton";
import { themeColors } from "../../types/chatTheme";
import { useTheme } from "../../contexts/ChatThemeContext";

export function ChatListSkeleton() {
  const { theme } = useTheme();

  return (
    <div className={`flex flex-col ${themeColors[theme].background}`}>
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`flex items-center p-4 border-b ${themeColors[theme].border}`}>
          <CustomSkeleton className="w-12 h-12 rounded-full mr-3" />
          <div className="flex-1">
            <CustomSkeleton className="h-4 w-24 mb-2" />
            <CustomSkeleton className="h-3 w-32" />
          </div>
          <CustomSkeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}
