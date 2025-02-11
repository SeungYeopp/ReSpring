import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  label: string;
  error?: string;
  disabledDays?: (date: Date) => boolean;
}

export function DatePicker({ date, onSelect, label, error, disabledDays }: DatePickerProps) {
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("w-full justify-start text-left font-normal border-spring-primary text-xs sm:text-sm px-2 py-1 truncate", error && "border-red-500")}>
            {/* <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0  text-[#638d3e]" /> */}
            <span className="truncate">{date ? format(date, "PPP", { locale: ko }) : label}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={onSelect} locale={ko} className="rounded-md border" disabled={disabledDays} />
        </PopoverContent>
      </Popover>
      {error && <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>}
    </div>
  );
}
