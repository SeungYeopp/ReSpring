package org.ssafy.respring.domain.challenge.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
public class ChallengeResponseDto {
    private Long id;
    private String title;
    private String description;
    private String image;
    private LocalDateTime registerDate;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Set<String> tags;
    private Long likes;
    private Long views;
    private Long participantCount;
    private UUID ownerId; // 챌린지 생성자 정보 포함
    private String chatroomUUID;
}
