package org.ssafy.respring.domain.book.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.ssafy.respring.domain.comment.dto.response.CommentResponseDto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
public class BookResponseDto {
	private String bookId;
	private UUID userId;
	private String authorName;
	private String title;
	private String content;
	private String coverImage;
	private Set<String> tags;
	private boolean isLiked;
	private Long likeCount;
	private Long viewCount;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private List<String> imageUrls; // ✅ 포함된 이미지 URL 리스트 추가
	private List<CommentResponseDto> comments;
}
