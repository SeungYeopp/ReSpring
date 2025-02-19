"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChallengeForm } from "../components/update/challnege-fom";
import { ChallengePreview } from "../components/update/challnege-preview";
import type { CreateChallenge, ChallengeCreateRequest } from "../types/challenge";
import { useMediaQuery } from "../hooks/use-media-query";
import { motion, AnimatePresence } from "framer-motion";
import { getSessionInfo } from "@/lib/api/user"; //   세션 정보 가져오기
import { createChallenge } from "@/lib/api/tomorrow"; //   새로운 API 호출

export default function CreateChallengePage() {
  const [challengeData, setChallengeData] = useState<Partial<CreateChallenge>>({});
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const router = useRouter();
  const getKSTDate = (date: Date) => {
    return new Date(date.getTime() + (9 * 60 * 60 * 1000)); // UTC → KST 변환
  };
  

  const handleSubmit = async (data: CreateChallenge) => {
    try {
      //   세션 정보 가져오기 (ownerId 확보)
      const sessionInfo = await getSessionInfo();
      const ownerId = sessionInfo.userId;

      const requestData: ChallengeCreateRequest = {
        title: data.title,
        description: data.description,
        tags: data.tags,
        startDate: getKSTDate(data.startDate).toISOString(),
        endDate: getKSTDate(data.endDate).toISOString(),
        image: data.image ?? undefined, // 이미지가 있을 경우 포함
      };

      //   새로운 API 호출
      const result = await createChallenge(requestData);

      //   챌린지 상세 페이지로 이동
      router.push(`/tomorrow/${result.id}`);
    } catch (error:any) {
      alert("챌린지 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
      
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  const handleChange = (newData: Partial<CreateChallenge>) => {
    setChallengeData((prevData) => ({ ...prevData, ...newData }));
  };

  return (
    <main className="min-h-screen bg-background pt-4 pb-16 md:pt-6 md:pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-1/2 lg:sticky lg:top-6">
            <ChallengeForm onSubmit={handleSubmit} onCancel={handleCancel} onChange={handleChange} />
          </div>
          <AnimatePresence>
            <motion.div className={`w-full ${isDesktop ? "lg:w-1/2" : ""}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <ChallengePreview
                title={challengeData.title || ""}
                description={challengeData.description || ""}
                tags={challengeData.tags || []}
                startDate={challengeData.startDate}
                endDate={challengeData.endDate}
                preview={challengeData.preview || ""}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
