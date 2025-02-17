"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isFuture,
  startOfDay,
} from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ChallengeCalendarProps {
  records: { [key: string]: "SUCCESS" | "FAIL" };
  // 챌린지 시작일과 종료일을 props로 받아, 달력에 표시할 날짜 범위를 제한함
  startDate: Date;
  endDate: Date;
}

export function ChallengeCalendar({ records, startDate, endDate }: ChallengeCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    // 컴포넌트 마운트 시 오늘 날짜를 currentMonth로 설정
    const today = new Date();
    setCurrentMonth(today);
  }, []);

  // 현재 달의 시작일부터 종료일까지의 날짜 배열 생성
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

  /**
   * getDateStatus 함수
   * @param date - 달력에 표시할 날짜
   * @returns 해당 날짜의 상태 ("SUCCESS", "FAIL", "success-today", "today", "future", "none")
   *
   * - 우선, 날짜를 startOfDay로 정규화한 후, "yyyy-MM-dd" 포맷의 문자열을 생성합니다.
   * - **추가 조건**: 만약 해당 날짜가 챌린지 시작일(startDate)보다 이전이거나 종료일(endDate)보다 이후라면 "none"을 반환합니다.
   * - 이후, 미래의 날짜이면 "future"를 반환합니다.
   * - 오늘인 경우, records 필드에서 SUCCESS 여부에 따라 "success-today" 또는 "today"를 반환합니다.
   * - 그 외의 경우, records에 저장된 상태값("SUCCESS" 또는 "FAIL")이 있다면 해당 값을, 없으면 "none"을 반환합니다.
   */
  const getDateStatus = (date: Date): "SUCCESS" | "FAIL" | "success-today" | "today" | "none" | "future" => {
    const normalizedDate = startOfDay(date);
    const dateString = format(normalizedDate, "yyyy-MM-dd");

    // 챌린지 기간 내에 있는지 확인 (챌린지 기간 외이면 상태를 표시하지 않음)
    const challengeStart = startOfDay(startDate);
    const challengeEnd = startOfDay(endDate);
    if (normalizedDate < challengeStart || normalizedDate > challengeEnd) return "none";

    // 미래 날짜 처리
    if (isFuture(normalizedDate)) return "future";

    // 오늘 날짜 처리: records에 SUCCESS가 기록되어 있으면 "success-today", 없으면 "today"
    if (isToday(normalizedDate)) {
      return records[dateString] === "SUCCESS" ? "success-today" : "today";
    }

    // 그 외의 과거 날짜: records에 기록된 상태값이 있으면 반환, 없으면 "none"
    return records[dateString] || "none";
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg border">
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
              <div
                key={day.toString()}
                className={cn(
                  "relative h-10 flex items-center justify-center",
                  !isSameMonth(day, currentMonth) && "text-gray-400",
                  status === "future" && "text-gray-400"
                )}
              >
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
                      {(status === "SUCCESS" || status === "success-today") && (
                        <span className="text-green-500">성공!</span>
                      )}
                      {status === "FAIL" && <span className="text-red-500">실패</span>}
                      {status === "today" && !records[format(day, "yyyy-MM-dd")] && (
                        <span className="text-blue-500">오늘</span>
                      )}
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
