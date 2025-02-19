package org.ssafy.respring.domain.challenge.dto.response;

import lombok.*;
import org.ssafy.respring.domain.challenge.vo.ChallengeStatus;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChallengeStatusResponseDto {
    private Long id;
    private String title;
    private String description;
    private String image;
    private LocalDateTime registerDate;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private ChallengeStatus status;
    private Long likes;
    private Long views;
    private Long participantCount;
    private Long chatRoomId; //   오픈채팅방 UUID 추가
}
