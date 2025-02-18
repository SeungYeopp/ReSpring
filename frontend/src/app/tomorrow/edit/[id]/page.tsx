"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { EditChallengeForm } from "../../components/update/edit-challenge-form";
import { ChallengePreview } from "../../components/update/challnege-preview";
import type { ChallengeDetail } from "../../types/challenge";
import { useMediaQuery } from "../../hooks/use-media-query";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";

async function fetchChallenge(id: string): Promise<ChallengeDetail> {
  const response = await fetch(`/challenges/${id}`);
  if (!response.ok) {
    throw new Error("챌린지 정보를 불러오지 못했습니다.");
  }
  return response.json();
}

async function updateChallenge(
  id: string,
  data: Partial<ChallengeDetail>,
  imageFile?: File
): Promise<ChallengeDetail> {
  // multipart/form-data 요청을 위한 FormData 생성
  const formData = new FormData();
  // API 명세에 따라 수정 가능한 필드는 description과 endDate입니다.
  const updateDto = {
    description: data.description,
    endDate: data.endDate,
  };
  // updateDto를 JSON Blob으로 추가합니다.
  formData.append(
    "updateDto",
    new Blob([JSON.stringify(updateDto)], { type: "application/json" })
  );
  // imageFile이 존재한다면 FormData에 추가합니다.
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await fetch(`/challenges/${id}`, {
    method: "PATCH",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("챌린지 수정에 실패했습니다.");
  }
  return response.json();
}

export default function EditChallengePage() {
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [updatedData, setUpdatedData] = useState<Partial<ChallengeDetail>>({});
  const isTablet = useMediaQuery("(min-width: 768px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchChallengeData = async () => {
      try {
        const challengeData = await fetchChallenge(id as string);
        setChallenge(challengeData);
      } catch (error) {
        console.error("Failed to fetch challenge details:", error);
        alert("챌린지 정보를 불러오지 못했습니다.");
      }
    };

    if (typeof id === "string") {
      fetchChallengeData();
    }
  }, [id]);

  const handleSubmit = useCallback(
    async (data: Partial<ChallengeDetail>, imageFile?: File) => {
      if (challenge) {
        try {
          const updatedChallenge = await updateChallenge(
            challenge.id.toString(),
            data,
            imageFile
          );
          setChallenge(updatedChallenge);
          alert("챌린지가 성공적으로 수정되었습니다!");
          router.push(`/tomorrow/${challenge.id}`);
        } catch (error) {
          console.error("챌린지 수정 중 오류 발생:", error);
          alert("챌린지 수정에 실패했습니다. 다시 시도해주세요.");
        }
      }
    },
    [challenge, router]
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  const handleChange = useCallback((newData: Partial<ChallengeDetail>) => {
    setUpdatedData((prevData) => ({ ...prevData, ...newData }));
  }, []);

  const previewData = useMemo(() => {
    return challenge ? { ...challenge, ...updatedData } : null;
  }, [challenge, updatedData]);

  if (!challenge) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-16 md:pt-0 md:pb-0">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2">
            <EditChallengeForm
              challenge={challenge}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              onChange={handleChange}
            />
          </div>
          {previewData && (
            <motion.div
              className="w-full lg:w-1/2 mt-8 lg:mt-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ChallengePreview
                title={previewData.title}
                description={previewData.description}
                tags={previewData.tags.map((tag) => tag.name)}
                startDate={new Date(previewData.startDate)}
                endDate={
                  typeof previewData.endDate === "string"
                    ? new Date(previewData.endDate)
                    : previewData.endDate
                }
                preview={typeof previewData.image === "string" ? previewData.image : ""}
              />
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}

