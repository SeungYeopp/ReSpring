package org.ssafy.respring.domain.challenge.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChallengeListResponseDto {
    private Long id;
    private String title;
    private String description;
    private String image;
    private LocalDateTime registerDate;
    private Long likes;
    private Long views;
    private Long participantCount;
}
