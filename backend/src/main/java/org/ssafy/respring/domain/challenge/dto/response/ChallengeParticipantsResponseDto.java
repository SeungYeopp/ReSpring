package org.ssafy.respring.domain.challenge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ChallengeParticipantsResponseDto {
    private Long challengeId;
    private int participantCount; // ✅ 총 참여자 수
    private List<ParticipantInfoDto> participantInfos; // ✅ 참여자 ID 목록
}
