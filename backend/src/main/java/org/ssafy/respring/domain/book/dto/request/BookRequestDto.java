package org.ssafy.respring.domain.book.dto.request;

import lombok.Data;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
public class BookRequestDto {
	private UUID userId;
	private String title;
	private String content;
	private Set<String> tags;
	private Set<Long> storyIds;
}
