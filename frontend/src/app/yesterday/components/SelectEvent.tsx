import { SelectableEntry } from "./SelectableEntry";

interface SelectEventProps {
  events: {
    id: number;
    eventName: string;
    occurredAt: string;
    category: string;
    display: boolean;
  }[];
  selected: number | null;
  onSelect: (id: number) => void;
}

const SelectEvent = ({ events, selected, onSelect }: SelectEventProps) => {
  return (
    <div className="flex flex-col space-y-2 p-4 mt-4">
      {events.map((entry) => (
        <SelectableEntry
          key={entry.id}
          id={entry.id}
          eventName={entry.eventName}
          occurredAt={entry.occurredAt}
          category={entry.category}
          isSelected={selected === entry.id}
          onClick={() => onSelect(entry.id)}
        />
      ))}
    </div>
  );
};

export default SelectEvent;