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
import {
  MAX_DESCRIPTION_LENGTH,
  MIN_DESCRIPTION_LENGTH,
} from "../../types/challenge";
import { DatePicker } from "./date-picker";
import { ImageUpload } from "./image-upload";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, FileText, Tags, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";

interface EditChallengeFormProps {
  challenge: ChallengeDetail;
  onSubmit: (data: Partial<ChallengeDetail>, imageFile?: File) => Promise<void>;
  onCancel: () => void;
  onChange: (data: Partial<ChallengeDetail>) => void;
}

export function EditChallengeForm({
  challenge,
  onSubmit,
  onCancel,
  onChange,
}: EditChallengeFormProps) {
  const [description, setDescription] = useState(challenge.description);
  const [endDate, setEndDate] = useState<Date>(new Date(challenge.endDate));
  // 실제 File 객체 저장 (제출 시 사용)
  const [image, setImage] = useState<File | undefined>();
  // 미리보기 URL (화면 표시 및 부모 onChange에 전달)
  const [preview, setPreview] = useState<string>(challenge.imageUrl || "");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const router = useRouter();

  // 임시: 모든 사용자에게 권한 부여
  const isAuthorized = true;

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newDescription = e.target.value;
      setDescription(newDescription);
      onChange({ description: newDescription });
      if (newDescription.length < MIN_DESCRIPTION_LENGTH) {
        setErrors((prev) => ({
          ...prev,
          description: `설명은 최소 ${MIN_DESCRIPTION_LENGTH}자 이상이어야 합니다.`,
        }));
      } else if (newDescription.length > MAX_DESCRIPTION_LENGTH) {
        setErrors((prev) => ({
          ...prev,
          description: `설명은 최대 ${MAX_DESCRIPTION_LENGTH}자까지 입력 가능합니다.`,
        }));
      } else {
        setErrors((prev) => ({ ...prev, description: "" }));
      }
    },
    [onChange]
  );

  // 이미지 변경 핸들러: File 객체와 미리보기 URL을 각각 업데이트
  const handleImageChange = useCallback(
    (file: File | null) => {
      if (file) {
        setImage(file); // 실제 파일 저장
        const reader = new FileReader();
        reader.onloadend = () => {
          const previewUrl = reader.result as string;
          setPreview(previewUrl); // 미리보기 URL 저장
          // onChange에는 미리보기 URL을 전달하여 부모의 previewData 유지
          onChange({ image: previewUrl });
        };
        reader.readAsDataURL(file);
      } else {
        setImage(undefined);
        setPreview("");
        onChange({ image: "" });
      }
    },
    [onChange]
  );

  const handleEndDateChange = useCallback(
    (date: Date | undefined) => {
      if (date) {
        setEndDate(date);
        onChange({ endDate: date.toISOString() });
        setErrors((prev) => ({ ...prev, endDate: "" }));
      } else {
        setErrors((prev) => ({ ...prev, endDate: "종료일을 선택해주세요." }));
      }
    },
    [onChange]
  );

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};

    // 설명 유효성 검사
    if (!description.trim()) {
      newErrors.description = "설명을 입력해주세요.";
    } else if (description.length < MIN_DESCRIPTION_LENGTH) {
      newErrors.description = `설명은 최소 ${MIN_DESCRIPTION_LENGTH}자 이상이어야 합니다.`;
    } else if (description.length > MAX_DESCRIPTION_LENGTH) {
      newErrors.description = `설명은 최대 ${MAX_DESCRIPTION_LENGTH}자까지 입력 가능합니다.`;
    }

    // 종료일 유효성 검사
    if (!endDate) {
      newErrors.endDate = "종료일을 선택해주세요.";
    }

    // 이미지 유효성 검사 (이미지가 없으면 에러)
    if (!preview) {
      newErrors.image = "이미지를 업로드해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [description, endDate, preview]);

  // 제출 핸들러: onSubmit에 미리보기 URL 대신 실제 File 객체를 두 번째 인자로 전달
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!isAuthorized) {
      toast({
        title: "권한 없음",
        description: "이 챌린지를 수정할 권한이 없습니다.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const challengeData: Partial<ChallengeDetail> = {
        description,
        endDate: endDate.toISOString(),
        // 여기서 image는 미리보기 URL(문자열)을 포함 (기존 값 유지)
        image: preview,
      };

      // onSubmit에 실제 File 객체도 함께 전달
      await onSubmit(challengeData, image);
      router.push(`/tomorrow/${challenge.id}`);
      toast({
        title: "챌린지 수정 성공",
        description: "챌린지가 성공적으로 수정되었습니다.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "챌린지 수정 실패",
        description: "챌린지 수정 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4">권한 없음</h1>
          <p>이 챌린지를 수정할 권한이 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardContent className="space-y-4 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <ImageUpload
                onImageChange={handleImageChange}
                preview={preview}
              />
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-4 h-4 text-[#8BC34A]" />
                <span className="text-sm text-gray-500">도전 제목</span>
              </div>
              <Input
                value={challenge.title}
                disabled
                className="bg-gray-50 border-[#8BC34A] text-gray-500"
              />
              <p className="text-xs text-right text-gray-500 mt-1">
                {challenge.title.length}/15
              </p>
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
                className={cn(
                  "min-h-[100px] border-[#8BC34A] focus:ring-[#8BC34A] resize-none",
                  errors.description && "border-red-500"
                )}
                maxLength={MAX_DESCRIPTION_LENGTH}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
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
                {challenge.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="bg-[#F8BBD0] text-gray-700 text-xs"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  태그는 수정할 수 없습니다.
                </p>
                <p className="text-xs text-gray-500">
                  태그 {challenge.tags.length}/3
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-[#8BC34A]" />
                <span className="text-sm text-gray-500">기간</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* 시작일 표시 (수정 불가) */}
                <div>
                  <Input
                    value={format(
                      new Date(challenge.startDate),
                      "yyyy년 MM월 dd일",
                      { locale: ko }
                    )}
                    disabled
                    className="bg-gray-50 border-[#8BC34A] text-gray-500 text-sm"
                  />
                </div>

                {/* 종료일 선택 */}
                <DatePicker
                  date={endDate}
                  onSelect={handleEndDateChange}
                  label="종료일 선택"
                  error={errors.endDate}
                  disabledDays={(date) => {
                    const startDate = new Date(challenge.startDate);
                    const nextDay = new Date(startDate);
                    nextDay.setDate(startDate.getDate() + 1);
                    return date < nextDay;
                  }}
                />

                <p className="text-xs text-gray-500 mt-1">
                  시작일 다음 날부터 선택 가능합니다.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-[#8BC34A] hover:bg-[#8BC34A]/5"
              >
                취소
              </Button>
              <Button
                type="submit"
                className="bg-[#8BC34A] hover:bg-[#8BC34A]/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "수정 중..." : "챌린지 수정하기"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
