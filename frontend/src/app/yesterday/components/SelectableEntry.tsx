import { getCategoryIcon } from "@/components/custom/EventCategories";
import { LucideIcon } from "lucide-react";

const SelectableEntry = ({
  id,
  eventName,
  occurredAt,
  category,
  isSelected,
  onClick,
}: {
  id: number;
  eventName: string;
  occurredAt: string;
  category: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const Icon: LucideIcon = getCategoryIcon(category); // 카테고리별 아이콘 가져오기

  return (
    <div
      onClick={onClick}
      className={`w-full p-4 border rounded-md cursor-pointer transition flex items-center justify-between ${
        isSelected ? "bg-brand text-white" : "bg-white hover:bg-gray-100"
      }`}
    >
      {/* 아이콘 추가 */}
      <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-gray-500"}`} />

      {/* 이벤트명 */}
      <span className="w-1/2 text-2xl font-bold text-left">{eventName}</span>

      {/* 날짜 */}
      <div className="flex flex-col">
        <span className={`text-sm ${isSelected ? "text-white" : "text-gray-500"}`}>
          {occurredAt}
        </span>
      </div>
    </div>
  );
};

export { SelectableEntry };
