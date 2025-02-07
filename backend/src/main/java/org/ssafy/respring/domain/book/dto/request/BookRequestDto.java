package org.ssafy.respring.domain.book.dto.request;

import lombok.Data;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Data
public class BookRequestDto {
	private UUID userId;
	private String title;
	private Map<String, String> content;
	private Set<String> tags;
	private Set<Long> storyIds;
}
