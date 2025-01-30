package org.ssafy.respring.domain.book.dto.request;

import lombok.Data;
import org.ssafy.respring.domain.image.dto.response.ImageResponseDTO;

import java.util.List;
import java.util.UUID;

@Data
public class BookRequestDto {
	private UUID userId;
	private String title;
	private String content;
	private String tag;
	private Long likes = 0L;
	private Long view = 0L;
	private List<Long> storyIds;
}
