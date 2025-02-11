"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isFuture, startOfDay } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ChallengeCalendarProps {
  records: { [key: string]: "SUCCESS" | "FAIL" };
  startDate: Date;
  endDate: Date;
}

export function ChallengeCalendar({ records, startDate, endDate }: ChallengeCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const today = new Date();
    setCurrentMonth(today);
  }, []);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const getDateStatus = (date: Date): "SUCCESS" | "FAIL" | "success-today" | "today" | "none" | "future" => {
    const normalizedDate = startOfDay(date);
    const dateString = format(normalizedDate, "yyyy-MM-dd");

    if (isFuture(normalizedDate)) return "future";

    if (isToday(normalizedDate)) {
      return records[dateString] === "SUCCESS" ? "success-today" : "today";
    }

    return records[dateString] || "none";
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-between p-4">
          <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="font-semibold text-xl">{format(currentMonth, "MMMM yyyy", { locale: ko })}</h2>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 p-4">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}

          {days.map((day) => {
            const status = getDateStatus(day);

            return (
              <div key={day.toString()} className={cn("relative h-10 flex items-center justify-center", !isSameMonth(day, currentMonth) && "text-gray-400", status === "future" && "text-gray-400")}>
                <div
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-full text-sm relative",
                    status === "SUCCESS" && "bg-green-100 text-green-700",
                    status === "FAIL" && "bg-red-100 text-red-700",
                    (status === "today" || status === "success-today") && "bg-blue-100 text-blue-700",
                    status === "future" && "bg-transparent"
                  )}
                >
                  {format(day, "d")}
                  {status !== "future" && status !== "none" && (
                    <span className="absolute -bottom-4 text-[10px]">
                      {(status === "SUCCESS" || status === "success-today") && <span className="text-green-500">성공!</span>}
                      {status === "FAIL" && <span className="text-red-500">실패</span>}
                      {status === "today" && !records[format(day, "yyyy-MM-dd")] && <span className="text-blue-500">오늘</span>}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
