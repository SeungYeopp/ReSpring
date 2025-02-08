package org.ssafy.respring.domain.book.dto.request;

import lombok.Data;

import java.util.Set;

@Data
public class BookUpdateRequestDto {
	private String title;
	private String content;
	private Set<String> tags;
	private Set<Long> storyIds;
}
