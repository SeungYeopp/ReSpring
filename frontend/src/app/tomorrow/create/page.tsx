"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChallengeForm } from "../components/update/challnege-fom";
import { ChallengePreview } from "../components/update/challnege-preview";
import type { CreateChallenge, ChallengeCreateRequest } from "../types/challenge";
import { useMediaQuery } from "../hooks/use-media-query";
import { motion, AnimatePresence } from "framer-motion";
import { getSessionInfo } from "@/lib/api/user"; // ✅ 세션 정보 가져오기

export default function CreateChallengePage() {
  const [challengeData, setChallengeData] = useState<Partial<CreateChallenge>>({});
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const router = useRouter();

  const handleSubmit = async (data: CreateChallenge) => {
    try {
      // ✅ 세션 정보 가져오기 (ownerId 확보)
      const sessionInfo = await getSessionInfo();
      const ownerId = sessionInfo.userId;

      const formData = new FormData();
      const requestData: ChallengeCreateRequest = {
        title: data.title,
        description: data.description,
        tags: data.tags,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        // ownerId: ownerId, // ✅ 동적으로 ownerId 설정
        ownerId: "dd5a7b3c-d887-11ef-b310-d4f32d147183", // 나중에 세션 정보로 대체 가능
      };

      formData.append("challengeDto", JSON.stringify(requestData));
      if (data.image) formData.append("image", data.image);

      const response = await fetch("/challenges", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("챌린지 생성 실패!");

      const result = await response.json();
      console.log("챌린지 생성 성공:", result);

      // ✅ 챌린지 생성 성공 후 상세 페이지로 이동
      router.push(`/tomorrow/${result.id}`);
    } catch (error) {
      console.error("API 호출 오류:", error);
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
