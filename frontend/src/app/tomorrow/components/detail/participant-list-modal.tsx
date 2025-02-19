"use client"; // Next.js 13 App Router에서 클라이언트 컴포넌트임을 명시

import { useEffect, useState, useCallback } from "react"; // 리액트 훅 import
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // shadCN 모달 컴포넌트
import { ScrollArea } from "@/components/ui/scroll-area"; // 스크롤 가능 영역 컴포넌트
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // 아바타(프로필 이미지) 컴포넌트
import Link from "next/link"; // 페이지 이동을 위한 next.js의 Link 컴포넌트
import type { Theme } from "../../types/theme"; // 테마 타입 import (다크모드, 라이트모드 같은 테마색 설정)
import { themeColors } from "../../types/theme"; // 테마 색상 설정 객체 import
import { fetchChallengeParticipants } from "@/lib/api"; // 챌린지 참여자 목록 API 호출 함수 import
import type { ChallengeParticipant } from "../../types/challenge"; // 원래 존재하는 API 응답 타입 import

/**
 * 모달 파일 내부에서만 사용하는 임시 API 응답 타입
 * - "participantInfos"의 타입을 우리가 원하는 대로 맞추기 위해 임시로 정의
 * - "challenge.ts" 타입 파일은 건드리고 싶지 않으니까, 여기서만 씀
 */
interface ChallengeParticipantTemp {
  challengeId: number;
  participantCount: number;
  participantInfos: ParticipantFromServer[];
}

/**
 * 서버에서 내려주는 참여자 정보 타입 (API 응답 그대로 받는 형태)
 * - 서버 응답의 필드명이 "userNickname", "profileImage" 이렇게 되어있어서 이걸 그대로 정의
 */
interface ParticipantFromServer {
  userNickname: string;
  profileImage: string;
}

/**
 * 화면에서 사용할 참여자 정보 타입
 * - 우리 프론트엔드에서는 userNickname을 그냥 nickname으로 쓰기로 했기 때문에 변환해서 사용
 * - nickname: 유저 고유 식별자로 활용
 * - profileImage: 프로필 이미지 URL
 */
interface Participant {
  nickname: string;
  profileImage: string;
}

/**
 * 모달 컴포넌트가 받을 props 타입
 */
interface ParticipantListModalProps {
  isOpen: boolean; // 모달 열림 여부 (true면 열림, false면 닫힘)
  onClose: () => void; // 모달 닫기 함수 (부모 컴포넌트에서 전달받음)
  challengeId: number; // 챌린지 ID (참여자 목록 불러올 때 필요)
  theme: Theme; // 테마 정보 (다크모드, 라이트모드 등)
}

/**
 * 챌린지 참여자 목록을 모달로 보여주는 컴포넌트
 */
export function ParticipantListModal({
  isOpen,
  onClose,
  challengeId,
  theme,
}: ParticipantListModalProps) {
  // 참여자 목록 상태 (서버에서 가져온 참여자 리스트를 담음)
  const [participants, setParticipants] = useState<Participant[]>([]);
  // 참여자 수 상태 (서버에서 가져온 참여자 수를 담음)
  const [participantCount, setParticipantCount] = useState(0);

  /**
   * 모달 닫기 핸들러
   * - 부모 컴포넌트에서 전달받은 onClose 함수를 실행해줌
   * - useCallback으로 감싸는 이유: 불필요하게 리렌더링되지 않도록 최적화하기 위해
   */
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  /**
   * 모달이 열릴 때 챌린지 참여자 목록 데이터를 서버에서 가져오는 효과
   * - 의존성 배열에 isOpen, challengeId를 넣어서, 모달 열릴 때마다 실행되도록 설정
   */
  useEffect(() => {
    // 모달이 열려 있을 때만 실행되도록 조건 설정
    if (isOpen) {
      // 비동기 함수로 데이터 가져오기
      async function loadParticipants() {
        try {
          // API 호출 -> ChallengeParticipantTemp 타입으로 명시
          const data = (await fetchChallengeParticipants(challengeId)) as unknown as ChallengeParticipantTemp;

          // 서버에서 받은 데이터의 필드명(userNickname)을 우리가 쓰는 nickname으로 변환
          const mappedParticipants = data.participantInfos.map((info) => ({
            nickname: info.userNickname,
            profileImage: info.profileImage,
          }));

          // 상태 업데이트: 참여자 목록과 참여자 수 저장
          setParticipants(mappedParticipants);
          setParticipantCount(data.participantCount);
        } catch (error) {
          // 에러 발생 시, 콘솔에 에러 출력 및 참여자 초기화
          console.error("챌린지 참여자 조회 실패:", error);
          setParticipants([]);
          setParticipantCount(0);
        }
      }

      // 비동기 함수 실행
      loadParticipants();
    }
  }, [isOpen, challengeId]);

  return (
    // shadCN Dialog 컴포넌트
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      {/* 모달 컨텐츠 영역 */}
      <DialogContent
        className={`sm:max-w-[425px] ${themeColors[theme].background} ${themeColors[theme].text}`}
      >
        {/* 모달 헤더 */}
        <DialogHeader>
          <DialogTitle className={`${themeColors[theme].text}`}>
            참여자 목록 ({participantCount}명)
          </DialogTitle>
        </DialogHeader>

        {/* 참여자 목록 스크롤 영역 */}
        <ScrollArea className={`h-[300px] w-full rounded-md border p-4 ${themeColors[theme].background}`}>
          {/* 참여자 목록이 있는 경우 */}
          {participants.length > 0 ? (
            participants.map((participant) => (
              <Link
                key={participant.nickname} // 닉네임이 고유값이니까 key로 사용
                href={`/profile/${participant.nickname}`} // 프로필 페이지로 이동
                className={`flex items-center space-x-4 mb-4 hover:${themeColors[theme].background} p-2 rounded-md transition-colors ${themeColors[theme].text}`}
              >
                <Avatar>
                  <AvatarImage
                    src={participant.profileImage} // 이미지 URL
                    alt={participant.nickname} // 대체 텍스트(접근성)
                  />
                  <AvatarFallback>{participant.nickname[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className={`text-sm font-medium leading-none ${themeColors[theme].text}`}>
                    {participant.nickname}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            // 참여자 없을 때 보여줄 문구
            <p className="text-center text-sm text-gray-500">참여자가 없습니다.</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
