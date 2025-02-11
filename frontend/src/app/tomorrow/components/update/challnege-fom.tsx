"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { X, PenTool, FileText, Tag, CalendarIcon } from "lucide-react";
import { ImageUpload } from "./image-upload";
import type { CreateChallenge, ChallengeFormProps } from "../../types/challenge";
import { cn } from "@/lib/utils";
import { MAX_TITLE_LENGTH, MIN_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH, MIN_DESCRIPTION_LENGTH } from "../../types/challenge";
import { DatePicker } from "./date-picker";
import { useRouter } from "next/navigation";

const MAX_TAGS = 3;
const MAX_TAG_LENGTH = 10;

export function ChallengeForm({ onSubmit, onCancel, onChange }: ChallengeFormProps & { onChange: (data: Partial<CreateChallenge>) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (tags.length >= MAX_TAGS) {
        setErrors({ ...errors, tags: `태그는 최대 ${MAX_TAGS}개까지 입력 가능합니다.` });
      } else if (tagInput.length > MAX_TAG_LENGTH) {
        setErrors({ ...errors, tags: `태그는 최대 ${MAX_TAG_LENGTH}자까지 입력 가능합니다.` });
      } else {
        const newTag = tagInput.trim().replace(",", "");
        if (!tags.includes(newTag)) {
          const newTags = [...tags, newTag];
          setTags(newTags);
          onChange({ tags: newTags });
        }
        setTagInput("");
        setErrors({ ...errors, tags: "" });
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    onChange({ tags: newTags });
  };

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setPreview(previewUrl);
        onChange({ image: file, preview: previewUrl });
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(undefined);
      onChange({ image: undefined, preview: undefined });
    }
    setErrors({ ...errors, image: "" });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "제목을 입력해주세요.";
    } else if (title.length < MIN_TITLE_LENGTH || title.length > MAX_TITLE_LENGTH) {
      newErrors.title = `제목은 ${MIN_TITLE_LENGTH}자 이상 ${MAX_TITLE_LENGTH}자 이하여야 합니다.`;
    }

    if (!description.trim()) {
      newErrors.description = "설명을 입력해주세요.";
    } else if (description.length < MIN_DESCRIPTION_LENGTH || description.length > MAX_DESCRIPTION_LENGTH) {
      newErrors.description = `설명은 ${MIN_DESCRIPTION_LENGTH}자 이상 ${MAX_DESCRIPTION_LENGTH}자 이하여야 합니다.`;
    }

    if (tags.length === 0) {
      newErrors.tags = "최소 한 개의 태그를 입력해주세요.";
    } else if (tags.length > MAX_TAGS) {
      newErrors.tags = `태그는 최대 ${MAX_TAGS}개까지 입력 가능합니다.`;
    }

    if (!image) {
      newErrors.image = "챌린지 이미지를 업로드해주세요.";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!startDate) {
      newErrors.startDate = "시작일을 선택해주세요.";
    } else if (startDate < today) {
      newErrors.startDate = "시작일은 오늘 이후여야 합니다.";
    }

    if (!endDate) {
      newErrors.endDate = "종료일을 선택해주세요.";
    } else if (endDate <= startDate!) {
      newErrors.endDate = "종료일은 시작일 이후여야 합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const challengeData: CreateChallenge = {
        title,
        description,
        tags,
        startDate: startDate!,
        endDate: endDate!,
        image: image!,
      };

      await onSubmit(challengeData); // ✅ 에러 발생 시 catch로 전달
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="mb-6">
            <ImageUpload onImageChange={handleImageChange} preview={preview} />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                <PenTool className="w-4 h-4 inline-block mr-2 text-[#8BC34A]" />
                도전 제목
              </label>
              <Input
                id="title"
                placeholder="도전 제목을 입력하세요"
                value={title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setTitle(newTitle);
                  onChange({ title: newTitle });
                  if (newTitle.length > MAX_TITLE_LENGTH) {
                    setErrors({ ...errors, title: `제목은 최대 ${MAX_TITLE_LENGTH}자까지 입력 가능합니다.` });
                  } else {
                    setErrors({ ...errors, title: "" });
                  }
                }}
                className={cn("border-[#8BC34A] focus:ring-[#8BC34A]", errors.title && "border-red-500")}
                maxLength={MAX_TITLE_LENGTH}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              <p className="text-sm text-gray-500 mt-1 text-right">
                {title.length}/{MAX_TITLE_LENGTH}
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                <FileText className="w-4 h-4 inline-block mr-2 text-[#8BC34A]" />
                도전 설명
              </label>
              <Textarea
                id="description"
                placeholder="도전에 대해 설명해주세요"
                value={description}
                onChange={(e) => {
                  const newDescription = e.target.value;
                  setDescription(newDescription);
                  onChange({ description: newDescription });
                  if (newDescription.length > MAX_DESCRIPTION_LENGTH) {
                    setErrors({
                      ...errors,
                      description: `설명은 최대 ${MAX_DESCRIPTION_LENGTH}자까지 입력 가능합니다.`,
                    });
                  } else {
                    setErrors({ ...errors, description: "" });
                  }
                }}
                className={cn("min-h-[100px] border-[#8BC34A] focus:ring-[#8BC34A]", errors.description && "border-red-500")}
                maxLength={MAX_DESCRIPTION_LENGTH}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              <p className="text-sm text-gray-500 mt-1 text-right">
                {description.length}/{MAX_DESCRIPTION_LENGTH}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                <Tag className="w-4 h-4 inline-block mr-2 text-[#F8BBD0]" />
                태그
              </label>
              <Input
                id="tags"
                placeholder="엔터 또는 쉼표로 추가하세요"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className={cn("w-full border-[#8BC34A] focus:ring-[#8BC34A]", errors.tags && "border-red-500")}
                maxLength={MAX_TAG_LENGTH}
              />
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2 flex-grow">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-[#F8BBD0] text-gray-700">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 hover:text-gray-900">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-500 whitespace-nowrap ml-2">
                  태그 {tags.length}/{MAX_TAGS}
                </p>
              </div>
              {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <CalendarIcon className="w-4 h-4 inline-block mr-2 text-[#8BC34A]" />
                  시작일
                </label>
                <DatePicker
                  date={startDate}
                  onSelect={(date) => {
                    setStartDate(date);
                    onChange({ startDate: date });
                    if (date && endDate && date >= endDate) {
                      setErrors({ ...errors, endDate: "종료일은 시작일 이후여야 합니다." });
                    } else {
                      setErrors({ ...errors, startDate: "", endDate: "" });
                    }
                  }}
                  label="시작일 선택"
                  error={errors.startDate}
                  disabledDays={(date) => date < new Date()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <CalendarIcon className="w-4 h-4 inline-block mr-2 text-[#8BC34A]" />
                  종료일
                </label>
                <DatePicker
                  date={endDate}
                  onSelect={(date) => {
                    setEndDate(date);
                    onChange({ endDate: date });
                    if (date && startDate && date <= startDate) {
                      setErrors({ ...errors, endDate: "종료일은 시작일 이후여야 합니다." });
                    } else {
                      setErrors({ ...errors, endDate: "" });
                    }
                  }}
                  label="종료일 선택"
                  error={errors.endDate}
                  disabledDays={(date) => date <= startDate!}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} className="border-[#8BC34A] text-[#8BC34A] hover:bg-[#8BC34A] hover:text-white">
            취소
          </Button>
          <Button type="submit" className="bg-[#8BC34A] hover:bg-[#7CB342] text-white" disabled={isLoading}>
            {isLoading ? "처리 중..." : "도전 생성하기"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
