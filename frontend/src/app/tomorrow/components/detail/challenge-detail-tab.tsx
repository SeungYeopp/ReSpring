"use client";

import { useEffect, useState } from "react";
import { ChallengeCalendar } from "./challnege-callender";
import { ExpandableDescription } from "./expandable-description";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Zap } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import type { ChallengeDetail } from "../../types/challenge";
import { ChallengeActionButton } from "./challenge-action-button";
import type { Theme } from "../../types/theme";
import {
  checkParticipationStatus,
  joinChallenge,
  recordChallengeSuccess,
  getSessionInfo,
} from "@/lib/api";
import { Separator } from "@/components/ui/separator";

interface ChallengeDetailTabProps {
  challenge: ChallengeDetail;
}

// Divider 컴포넌트 (기존 주석 그대로 유지)
const Divider = ({ thick = false }: { thick?: boolean }) => (
  <div className={`h-px bg-gray-200 my-3 ${thick ? "h-0.5" : ""}`} />
);

export function ChallengeDetailTab({ challenge }: ChallengeDetailTabProps) {
  // localChallenge: prop으로 받은 챌린지 상세 정보를 로컬 상태로 관리
  const [localChallenge, setLocalChallenge] = useState(challenge);
  // isParticipating: 사용자가 챌린지에 참여 중인지 여부
  const [isParticipating, setIsParticipating] = useState(false);

  // 오늘 날짜의 문자열 생성
  const todayString = format(new Date(), "yyyy-MM-dd");
  // challenge.records에 오늘 기록이 "SUCCESS"인지 확인하여 초기 상태 설정
  const initialTodayCompleted = challenge.records
    ? challenge.records[todayString] === "SUCCESS"
    : false;
  // isTodayCompleted: 오늘의 도전 완료 여부 (초기 상태를 직접 계산)
  const [isTodayCompleted, setIsTodayCompleted] = useState(
    initialTodayCompleted
  );

  // theme: UI 테마 (light/dark 등)
  const [theme, setTheme] = useState<Theme>("light");
  // currentUserId: 현재 로그인한 사용자의 ID (세션 정보에서 가져옴)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // startDate, endDate를 Date 객체로 변환 (챌린지 기간 계산에 사용)
  const startDate = parseISO(localChallenge.startDate);
  const endDate = parseISO(localChallenge.endDate);

  // 전체 도전 기간(일 수) 계산 함수
  const calculateTotalDays = () => {
    return differenceInDays(endDate, startDate) + 1;
  };

  // 전체 성공 횟수 계산 함수 (records에서 SUCCESS 상태의 갯수)
  const calculateTotalSuccess = () => {
    return localChallenge.records
      ? Object.values(localChallenge.records).filter(
          (status) => status === "SUCCESS"
        ).length
      : 0;
  };

  const totalDays = calculateTotalDays();
  const totalSuccess = calculateTotalSuccess();

  // 오늘의 도전 완료 핸들러
  const handleCompleteToday = async () => {
    try {
      // API 호출: 오늘의 도전 성공 기록 처리
      recordChallengeSuccess(challenge.id, true);
      // 로컬 상태 업데이트: 오늘 날짜에 SUCCESS 기록 추가 및 successToday 플래그 true 설정
      setLocalChallenge((prev) => ({
        ...prev,
        records: {
          ...prev.records,
          [format(new Date(), "yyyy-MM-dd")]: "SUCCESS",
        },
        successToday: true,
      }));
      setIsTodayCompleted(true);
    } catch (error) {
      console.error("Failed to complete challenge:", error);
    }
  };

  // 챌린지 참가 핸들러
  const handleJoinChallenge = async () => {
    try {
      const success = await joinChallenge(localChallenge.id);
      if (success) {
        // API 호출 후 참여 성공 시 상태 업데이트
        setIsParticipating(true);
      }
    } catch (error) {
      console.error("챌린지 참가 중 오류 발생:", error);
    }
  };

  // 기존 API를 호출하여 사용자의 참여 상태를 가져오는 useEffect (기존 주석 그대로 유지)
  useEffect(() => {
    async function fetchParticipationStatus() {
      try {
        const response = await checkParticipationStatus(challenge.id); // Example API call
        setIsParticipating(response); // 응답이 boolean 값이라고 가정
      } catch (error) {
        console.error("Error fetching participation status:", error);
        setIsParticipating(false); // API 호출 실패 시 false로 설정
      }
    }

    fetchParticipationStatus();
  }, []);

  // 새로 추가된 부분: 현재 로그인한 사용자의 세션 정보를 통해 currentUserId를 가져옵니다.
  useEffect(() => {
    async function fetchSession() {
      try {
        const sessionInfo = await getSessionInfo();
        setCurrentUserId(sessionInfo.userId);
      } catch (error) {
        console.error("세션 정보 로드 실패:", error);
      }
    }
    fetchSession();
  }, []);

  // 현재 사용자가 챌린지의 소유자인지 여부 계산
  // 챌린지 소유자 ID(challenge.ownerId)와 currentUserId를 비교합니다.
  const isOwner = challenge.ownerId === currentUserId;

  // **추가된 조건**: 오늘 날짜가 챌린지 기간(시작일 ~ 종료일) 내에 있는지 확인합니다.
  const today = new Date();
  const isChallengeActive = today >= startDate && today <= endDate;

  return (
    <div className="space-y-6 p-5">
      {/* 태그와 참여자 목록을 같은 줄에 배치 */}
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2 -mb-3">
          {localChallenge.tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="bg-[#F8BBD0] text-gray-700"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
        <div></div>
      </div>

      {/* 챌린지 설명 확장 컴포넌트 */}
      <ExpandableDescription description={localChallenge.description} />
      <Separator className="m-0 p-0" />

      {/* 기존의 프로그레스와 참여 현황 부분은 주석 처리되어 있음 */}
      {/* 삭제할 부분 */}
      {/* <div className="flex justify-between items-center">
        <div className="w-3/5">
          <h4 className="text-base lg:text-lg font-semibold flex items-center mb-2">
            <CalendarIcon className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-blue-500" />
            성공률
          </h4>
          <Progress value={localChallenge.successRate} className="w-full" />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs lg:text-sm font-semibold flex items-center">
              <Flame className="w-4 h-4 lg:w-5 lg:h-5 mr-1 text-orange-600" />
              현재 연속 달성 {localChallenge.currentStreak}일
            </p>
            <p className="text-xs lg:text-sm">{localChallenge.successRate.toFixed(1)}%</p>
          </div>
        </div>
        <div className="text-right">
          <h4 className="text-base lg:text-lg font-semibold flex items-center justify-end mb-2">
            <Users className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-indigo-500" />
            참여 현황
          </h4>
          <Button variant="outline" size="sm" onClick={handleParticipantListClick} className="text-xs lg:text-sm">
            {localChallenge.participantCount}명 참여 중
          </Button>
        </div>
      </div> */}

      {/* 달성 기록 섹션 */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-base lg:text-lg font-semibold flex items-center">
            <CalendarIcon className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-[#8BC34A]" />
            달성 기록
          </h4>
          <div className="flex items-center">
            <Zap className="w-4 h-4 lg:w-5 lg:h-5 mr-1 text-yellow-500" />
            <span className="text-sm lg:text-base font-semibold">
              성공률: {localChallenge.successRate.toFixed(1)}%
            </span>
          </div>
        </div>
        <ChallengeCalendar
          records={localChallenge.records || {}}
          startDate={startDate}
          endDate={endDate}
        />
      </div>

      {/* ChallengeActionButton 컴포넌트에 소유자 여부와 챌린지 기간 활성 여부를 전달 */}
      <ChallengeActionButton
        isParticipating={isParticipating}
        isTodayCompleted={isTodayCompleted}
        theme={theme}
        onComplete={handleCompleteToday}
        onJoin={handleJoinChallenge}
        isOwner={isOwner} // 소유자인 경우, ChallengeActionButton 내부에서 참여하기 버튼을 숨김
        isActive={isChallengeActive} // 오늘이 챌린지 기간 내일 때만 '오늘의 도전 완료하기' 버튼을 표시
      />
    </div>
  );
}
