"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { ChallengeDetail } from "../../types/challenge";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { MAX_DESCRIPTION_LENGTH, MIN_DESCRIPTION_LENGTH } from "../../types/challenge";
import { DatePicker } from "./date-picker";
import { ImageUpload } from "./image-upload";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, FileText, Tags, Calendar } from "lucide-react";

interface EditChallengeFormProps {
  challenge: ChallengeDetail;
  onSubmit: (data: Partial<ChallengeDetail>) => Promise<void>;
  onCancel: () => void;
  onChange: (data: Partial<ChallengeDetail>) => void;
}

export function EditChallengeForm({ challenge, onSubmit, onCancel, onChange }: EditChallengeFormProps) {
  const [description, setDescription] = useState(challenge.description);
  const [endDate, setEndDate] = useState<Date>(new Date(challenge.endDate));
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState<string>(challenge.image || "");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newDescription = e.target.value;
      setDescription(newDescription);
      onChange({ description: newDescription });
      if (newDescription.length < MIN_DESCRIPTION_LENGTH) {
        setErrors((prev) => ({ ...prev, description: `설명은 최소 ${MIN_DESCRIPTION_LENGTH}자 이상이어야 합니다.` }));
      } else if (newDescription.length > MAX_DESCRIPTION_LENGTH) {
        setErrors((prev) => ({ ...prev, description: `설명은 최대 ${MAX_DESCRIPTION_LENGTH}자까지 입력 가능합니다.` }));
      } else {
        setErrors((prev) => ({ ...prev, description: "" }));
      }
    },
    [onChange]
  );

  const handleImageChange = useCallback(
    (file: File | null) => {
      if (file) {
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          const previewUrl = reader.result as string;
          setPreview(previewUrl);
          onChange({ image: previewUrl }); // 이미지 미리보기 URL 전달
        };
        reader.readAsDataURL(file);
      } else {
        setImage(undefined);
        setPreview("");
        onChange({ image: undefined });
      }
    },
    [onChange]
  );

  const handleEndDateChange = useCallback(
    (date: Date | undefined) => {
      if (date) {
        setEndDate(date);
        onChange({ endDate: date.toISOString() }); // 날짜를 문자열로 변환하여 전달
        setErrors((prev) => ({ ...prev, endDate: "" }));
      } else {
        setErrors((prev) => ({ ...prev, endDate: "종료일을 선택해주세요." }));
      }
    },
    [onChange]
  );

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};

    if (!description.trim()) {
      newErrors.description = "설명을 입력해주세요.";
    } else if (description.length < MIN_DESCRIPTION_LENGTH) {
      newErrors.description = `설명은 최소 ${MIN_DESCRIPTION_LENGTH}자 이상이어야 합니다.`;
    } else if (description.length > MAX_DESCRIPTION_LENGTH) {
      newErrors.description = `설명은 최대 ${MAX_DESCRIPTION_LENGTH}자까지 입력 가능합니다.`;
    }

    if (!endDate) {
      newErrors.endDate = "종료일을 선택해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [description, endDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // 폼 내에서 직접 알림 표시
      toast({
        title: "폼 검증 실패",
        description: "입력한 내용을 확인해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const challengeData: Partial<ChallengeDetail> = {
        description,
        endDate: endDate.toISOString(),
        image: preview,
      };
      await onSubmit(challengeData); // 검증 성공 시만 부모 컴포넌트로 전달
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardContent className="space-y-4 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <ImageUpload onImageChange={handleImageChange} preview={preview} />

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-4 h-4 text-[#8BC34A]" />
                <span className="text-sm text-gray-500">도전 제목</span>
              </div>
              <Input value={challenge.title} disabled className="bg-gray-50 border-[#8BC34A] text-gray-500" />
              <p className="text-xs text-right text-gray-500 mt-1">{challenge.title.length}/100</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-[#8BC34A]" />
                <span className="text-sm text-gray-500">도전 설명</span>
              </div>
              <Textarea
                placeholder="챌린지를 설명해주세요"
                value={description}
                onChange={handleDescriptionChange}
                className={cn("min-h-[100px] border-[#8BC34A] focus:ring-[#8BC34A] resize-none", errors.description && "border-red-500")}
                maxLength={MAX_DESCRIPTION_LENGTH}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              <p className="text-xs text-right text-gray-500 mt-1">
                {description.length}/{MAX_DESCRIPTION_LENGTH}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tags className="w-4 h-4 text-[#F8BBD0]" />
                <span className="text-sm text-gray-500">태그</span>
              </div>
              <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg border border-[#8BC34A] min-h-[42px] mb-2">
                {challenge.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="bg-[#F8BBD0] text-gray-700 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-500">태그는 수정할 수 없습니다.</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-[#8BC34A]" />
                <span className="text-sm text-gray-500">기간</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input value={format(new Date(challenge.startDate), "yyyy년 MM월 dd일", { locale: ko })} disabled className="bg-gray-50 border-[#8BC34A] text-gray-500 text-sm" />
                <DatePicker date={endDate} onSelect={handleEndDateChange} label="종료일 선택" error={errors.endDate} disabledDays={(date) => new Date(challenge.startDate) >= date} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="border-[#8BC34A] hover:bg-[#8BC34A]/5">
                취소
              </Button>
              <Button type="submit" className="bg-[#8BC34A] hover:bg-[#8BC34A]/90 text-white" disabled={isLoading}>
                {isLoading ? "수정 중..." : "챌린지 수정하기"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
