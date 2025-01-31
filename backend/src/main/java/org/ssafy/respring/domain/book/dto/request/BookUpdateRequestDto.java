package org.ssafy.respring.domain.book.dto.request;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class BookUpdateRequestDto {
	private String title;
	private String content;
	private List<String> tag;
	private List<Long> storyIds;
}
