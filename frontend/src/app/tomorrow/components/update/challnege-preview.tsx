import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Users, Heart, MessageSquare, ImageIcon, CalendarIcon, Tag, PenTool, FileText } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { ChallengePreviewProps } from "../../types/challenge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export function ChallengePreview({ title, description, tags, startDate, endDate, preview }: ChallengePreviewProps) {
  const highlightDates = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const [currentMonth, setCurrentMonth] = useState<Date>(startDate || new Date());

  return (
    <Card className="w-full md:max-w-xl mx-auto overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl font-bold">미리보기</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-6">
          {preview ? (
            <Image src={preview || "/placeholder.svg"} alt="Challenge preview" fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <ImageIcon className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>
        <h3 className="text-2xl font-semibold mb-4 break-words flex items-center">
          <PenTool className="w-6 h-6 mr-2 text-[#8BC34A]" />
          {title || "도전 제목"}
        </h3>
        <div className="flex items-start mb-6">
          <FileText className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-[#8BC34A]" />
          <p className="text-gray-600 whitespace-pre-wrap break-words">{description || "도전 설명"}</p>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold flex items-center mb-2">
            <CalendarIcon className="w-5 h-5 mr-2 text-[#8BC34A]" />
            도전 기간
          </h4>
          <div className="flex justify-center items-center">
            <Calendar
              mode="single"
              selected={startDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              defaultMonth={startDate || new Date()}
              fromDate={startDate || new Date()}
              toDate={endDate || undefined}
              modifiers={{ highlight: highlightDates }}
              modifiersStyles={{
                highlight: { backgroundColor: "#8BC34A", color: "white" },
              }}
              className="rounded-md border"
            />
          </div>
          {startDate && endDate && (
            <p className="text-gray-600 mt-2 text-center">
              {format(startDate, "PPP", { locale: ko })} - {format(endDate, "PPP", { locale: ko })}
            </p>
          )}
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold flex items-center mb-2">
            <Tag className="w-5 h-5 mr-2 text-[#F8BBD0]" />
            태그
          </h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-[#F8BBD0] text-gray-700">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#8BC34A]" />
            <span className="text-gray-600">0명 참여</span>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="text-gray-600">0개 좋아요</span>
          </div>
        </div>

        <div className="bg-gray-50 -mx-6 -mb-6 px-6 py-4">
          <h4 className="text-lg font-semibold flex items-center mb-4">
            <MessageSquare className="w-5 h-5 mr-2 text-[#8BC34A]" />
            댓글
          </h4>
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-start space-x-4 mb-4 last:mb-0">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
