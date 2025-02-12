package org.ssafy.respring.domain.book.dto.response;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ssafy.respring.domain.book.vo.Book;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookResponseDto {
	private Long id;
	private UUID authorId;
	private String title;
	private String coverImage;
	private Set<String> tags;
	private boolean isLiked;
	private Long likeCount;
	private Long viewCount;
	private Set<UUID> likedUsers;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	public static BookResponseDto toResponseDto(Book book, boolean isLiked, Long likeCount, Set<UUID> likedUsers, Long viewCount, String coverImage) {
		return BookResponseDto.builder()
				.id(book.getId())
				.authorId(book.getAuthor().getId())
				.createdAt(book.getCreatedAt())
				.updatedAt(book.getUpdatedAt())
				.title(book.getTitle())
				.coverImage(coverImage)
				.tags(book.getTags())
				.isLiked(isLiked)
				.likedUsers(likedUsers)
				.likeCount(likeCount)
				.viewCount(viewCount)
				.createdAt(book.getCreatedAt())
				.updatedAt(book.getUpdatedAt())
				.build();
	}
}