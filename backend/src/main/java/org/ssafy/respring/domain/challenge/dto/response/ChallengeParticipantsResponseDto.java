package org.ssafy.respring.domain.challenge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class ChallengeParticipantsResponseDto {
    private Long challengeId;
    private int participantCount; // ✅ 총 참여자 수
    private List<UUID> participantIds; // ✅ 참여자 ID 목록
}
