"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { EditChallengeForm } from "../../components/update/edit-challenge-form";
import { ChallengePreview } from "../../components/update/challnege-preview";
import type { ChallengeDetail, ChallengeUpdateRequest } from "../../types/challenge";
import { useMediaQuery } from "../../hooks/use-media-query";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { getChallengeDetail, updateChallenge } from "@/lib/api/tomorrow";
import LoadingScreen from "@/components/custom/LoadingScreen";
import { getUserInfo } from "@/lib/api/user"; // 유저 정보를 가져오는 함수

/**
 * 챌린지 수정 페이지 컴포넌트
 * 챌린지 정보 수정 폼과 미리보기를 제공합니다.
 */
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
        const challengeData = await getChallengeDetail(Number(id));
        setChallenge(challengeData);
      } catch (error) {
        console.error("Failed to fetch challenge details:", error);
        alert("챌린지 정보를 불러오지 못했습니다.");
      }
    };

    if (id) {
      fetchChallengeData();
    }
  }, [id]);

  const handleSubmit = useCallback(
    async (data: Partial<ChallengeDetail>, imageFile?: File) => {
      if (challenge) {
        try {
          // getUserInfo()를 통해 유저 정보를 받아서 userInfo.userId 사용
          const userInfo = await getUserInfo();

          const updateData: ChallengeUpdateRequest = {
            description: data.description,
            endDate: data.endDate,
            image: imageFile,
            ownerId: userInfo.userId, // 필수 필드 추가
          };

          const updatedChallenge = await updateChallenge(challenge.id, updateData);
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

  /**
   * 수정 가능한 필드만 변경 사항 반영
   */
  const handleChange = useCallback((newData: Partial<ChallengeDetail>) => {
    setUpdatedData((prevData) => ({
      ...prevData,
      description: newData.description ?? prevData.description,
      endDate: newData.endDate ?? prevData.endDate,
      image: newData.image ?? prevData.image,
    }));
  }, []);

  const previewData = useMemo(() => {
    return challenge ? { ...challenge, ...updatedData } : null;
  }, [challenge, updatedData]);

  if (!challenge) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-16 md:pt-0 md:pb-0">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2">
            <EditChallengeForm challenge={challenge} onSubmit={handleSubmit} onCancel={handleCancel} onChange={handleChange} />
          </div>
          {previewData && (
            <motion.div className="w-full lg:w-1/2 mt-8 lg:mt-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <ChallengePreview
                title={previewData.title}
                description={previewData.description}
                tags={previewData.tags.map((tag) => tag.name)}
                startDate={new Date(previewData.startDate)}
                endDate={typeof previewData.endDate === "string" ? new Date(previewData.endDate) : previewData.endDate}
                preview={typeof previewData.image === "string" ? previewData.image : challenge.image}
              />
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
