package org.ssafy.respring.domain.challenge.dto.request;

import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Getter
public class ChallengeUpdateRequestDto {
    private String description;
    private LocalDate endDate;
    private Set<String> tags;
}
