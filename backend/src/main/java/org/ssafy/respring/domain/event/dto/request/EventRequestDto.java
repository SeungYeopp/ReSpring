package org.ssafy.respring.domain.event.dto.request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventRequestDto {
    private String eventName;
    private LocalDateTime occurredAt;
    private boolean isDisplay;
    private String category;
}
