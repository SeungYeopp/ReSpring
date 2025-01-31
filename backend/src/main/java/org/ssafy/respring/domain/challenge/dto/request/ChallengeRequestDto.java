package org.ssafy.respring.domain.challenge.dto.request;

import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChallengeRequestDto {
    private String title;
    private String description;
    private String image;
    private LocalDate startDate;
    private LocalDate endDate;
    private Set<String> tags;
}
