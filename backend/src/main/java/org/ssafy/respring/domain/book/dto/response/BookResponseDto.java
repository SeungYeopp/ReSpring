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
	@JsonProperty("id")
	private Long id;
	@JsonProperty("authorId")
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

//	@JsonCreator // ✅ JSON 역직렬화를 위해 추가
//	public BookResponseDto(
//	  @JsonProperty("id") Long bookId,
//	  @JsonProperty("title") String title,
//	  @JsonProperty("authorId") UUID authorId,
//	  @JsonProperty("tags") Set<String> tags
//	) {
//		this.id = bookId;
//		this.title = title;
//		this.authorId = authorId;
//		this.tags = tags;
//	}

	public static BookResponseDto toResponseDto(Book book, boolean isLiked, Long likeCount, Set<UUID> likedUsers, Long viewCount) {
		return BookResponseDto.builder()
				.id(book.getId())
				.authorId(book.getAuthor().getId())
				.title(book.getTitle())
				.coverImage(book.getCoverImage())
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