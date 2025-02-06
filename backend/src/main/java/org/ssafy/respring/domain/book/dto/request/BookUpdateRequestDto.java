package org.ssafy.respring.domain.book.dto.request;

import lombok.Data;
import org.ssafy.respring.domain.book.vo.Chapter;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
public class BookUpdateRequestDto {
	private UUID userId;
	private Long bookId;
	private String title;
	private List<Chapter> chapters;
	private String coverImage;
	private Set<String> tags;
	private Set<Long> storyIds;
}
