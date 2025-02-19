package org.ssafy.respring.domain.event.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class EventResponseDto {
	private Long id;
	private String eventName;
	private LocalDateTime occurredAt;
	private boolean isDisplay;
	private String category;
}
