package org.ssafy.respring.domain.challenge.dto.request;

import lombok.Getter;

import java.time.LocalDate;
import java.util.Set;

@Getter
public class ChallengeUpdateRequestDto {
    private String description;
    private LocalDate endDate;
    private Set<String> tags;
}
