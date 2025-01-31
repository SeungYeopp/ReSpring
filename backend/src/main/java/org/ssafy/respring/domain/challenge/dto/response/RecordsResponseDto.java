package org.ssafy.respring.domain.challenge.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecordsResponseDto {
    private Long id;
    private UUID userId;
    private LocalDate startDate;
    private LocalDate endDate;
}
