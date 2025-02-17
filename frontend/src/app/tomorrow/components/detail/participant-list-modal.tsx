"use client";

import { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import type { Theme } from "../../types/theme";
import { themeColors } from "../../types/theme";
import { fetchChallengeParticipants } from "@/lib/api"; // 실제 API 호출 함수 import

// 서버 응답의 참여자 정보를 위한 타입
interface ParticipantInfoFromServer {
  userNickname: string;
  profileImage: string;
}

// UI에서 사용할 참여자 타입
interface Participant {
  userId: string;
  nickname: string;
  profileImage: string;
}

// ParticipantListModalProps 인터페이스: 챌린지 ID와 테마, onClose 함수를 prop으로 받습니다.
interface ParticipantListModalProps {
  isOpen: boolean;
  onClose: () => void;
  challengeId: number; // 챌린지 ID
  theme: Theme;
}

export function ParticipantListModal({
  isOpen,
  onClose,
  challengeId,
  theme,
}: ParticipantListModalProps) {
  // API 호출 결과를 저장할 상태
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantCount, setParticipantCount] = useState(0);

  // onClose를 안정적으로 래핑 (부모에서 전달한 함수를 그대로 사용)
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Modal이 열릴 때 해당 챌린지의 참여자 정보를 가져옵니다.
  useEffect(() => {
    if (isOpen) {
      async function loadParticipants() {
        try {
          const data = await fetchChallengeParticipants(challengeId) as any;
          console.log("챌린지 참여자 조회 응답:", data);

          // 서버 응답의 필드 이름은 participantInfos입니다.
          const infos = (data.participantInfos as ParticipantInfoFromServer[]) ?? [];
          const participantsArray = infos.map((info, idx) => ({
            // 서버에 userId가 없으므로 임시로 index를 사용합니다.
            userId: `temp-${idx}`,
            nickname: info.userNickname,
            profileImage: info.profileImage,
          }));

          setParticipants(participantsArray);
          setParticipantCount(data.participantCount ?? 0);
        } catch (error) {
          console.error("챌린지 참여자 조회 실패:", error);
          setParticipants([]);
          setParticipantCount(0);
        }
      }
      loadParticipants();
    }
  }, [isOpen, challengeId]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent
        className={`sm:max-w-[425px] ${themeColors[theme].background} ${themeColors[theme].text}`}
      >
        <DialogHeader>
          <DialogTitle className={`${themeColors[theme].text}`}>
            참여자 목록 ({participantCount}명)
          </DialogTitle>
        </DialogHeader>
        <ScrollArea
          className={`h-[300px] w-full rounded-md border p-4 ${themeColors[theme].background}`}
        >
          {participants.map((participant) => (
            <Link
              key={participant.userId}
              href={`/profile/${participant.nickname}`}
              className={`flex items-center space-x-4 mb-4 hover:${themeColors[theme].background} p-2 rounded-md transition-colors ${themeColors[theme].text}`}
            >
              <Avatar>
                <AvatarImage
                  src={participant.profileImage}
                  alt={participant.nickname}
                />
                <AvatarFallback>{participant.nickname[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className={`text-sm font-medium leading-none ${themeColors[theme].text}`}>
                  {participant.nickname}
                </p>
              </div>
            </Link>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
