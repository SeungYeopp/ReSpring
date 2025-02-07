package org.ssafy.respring.domain.book.dto.response;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.ssafy.respring.domain.book.vo.Book;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
public class BookResponseDto {
	private Long bookId;
	private String authorName;
	private String title;
	private String coverImage;
	private Set<String> tags;
	private boolean isLiked;
	private Long likeCount;
	private Long viewCount;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	public static BookResponseDto toResponseDto(Book book, boolean isLiked, Long likeCount, Long viewCount) {
		return BookResponseDto.builder()
				.bookId(book.getId())
				.authorName(book.getAuthor().getUserNickname())
				.title(book.getTitle())
				.coverImage(book.getCoverImage())
				.tags(book.getTags())
				.isLiked(isLiked)
				.likeCount(likeCount)
				.viewCount(viewCount)
				.createdAt(book.getCreatedAt())
				.updatedAt(book.getUpdatedAt())
				.build();
	}
}