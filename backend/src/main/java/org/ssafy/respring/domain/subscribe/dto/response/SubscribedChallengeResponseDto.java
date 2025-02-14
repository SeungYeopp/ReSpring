package org.ssafy.respring.domain.subscribe.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscribedChallengeResponseDto {
    private Long challengeId;
    private String title;
    private String description;
    private String image;
    private LocalDateTime registerDate;
    private Long likes;
    private Long views;
    private Long participantCount;

    // ✅ 추가: 챌린지 생성자 정보 (구독한 사람이 만든 챌린지인지 확인)
    private UUID ownerId;
    private String ownerNickname;
}