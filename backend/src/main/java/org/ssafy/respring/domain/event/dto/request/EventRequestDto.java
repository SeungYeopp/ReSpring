package org.ssafy.respring.domain.event.dto.request;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class EventRequestDto {
	private String eventName;
	private LocalDateTime occurredAt;
	private boolean isDisplay;
	private String category;
}
