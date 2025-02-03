package org.ssafy.respring.domain.book.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
public class BookResponseDto {
	private String id;
	private UUID userId;
	private String title;
	private String content;
	private String coverImg;
	private Set<String> tags;
	private Long likeCount;
	private Long viewCount;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private Set<Long> storyIds;
	private Set<String> imageUrls; // ✅ 포함된 이미지 URL 리스트 추가
}
