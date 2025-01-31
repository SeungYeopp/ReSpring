package org.ssafy.respring.domain.challenge.dto.request;

import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecordsRequestDto {
    private UUID userId;
    private LocalDate startDate;
    private LocalDate endDate;
}
