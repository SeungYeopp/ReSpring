package org.ssafy.respring.domain.challenge.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChallengeResponseDto {
    private Long id;
    private String title;
    private String description;
    private String image;
    private LocalDate startDate;
    private LocalDate endDate;
    private Set<String> tags;
    private int likes;
    private int views;
    private int participantCount;
}
