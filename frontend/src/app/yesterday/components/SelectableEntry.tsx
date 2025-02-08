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
  return (
    <div
      onClick={onClick}
      className={`w-full p-4 border rounded-md cursor-pointer transition flex justify-between items-center ${
        isSelected ? "bg-green-500 text-white" : "bg-white hover:bg-gray-100"
      }`}
    >
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{occurredAt}</span>
      </div>
      <span className="w-1/2 text-2xl font-bold text-left">{eventName}</span>
    </div>
  );
};

export { SelectableEntry };