package org.ssafy.respring.domain.book.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.comment.dto.response.CommentResponseDto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

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
				.authorName(book.getAuthor().getUserNickname()) // 가정: User 엔티티에 getUsername()이 있다고 가정
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
