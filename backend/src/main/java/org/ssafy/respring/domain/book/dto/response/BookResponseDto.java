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
	private String content;
	private String coverImage;
	private Set<String> tags;
	private boolean isLiked;
	private Long likeCount;
	private Long viewCount;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private List<String> imageUrls; // ✅ 포함된 이미지 URL 리스트 추가
	// private List<CommentResponseDto> comments;

	public static BookResponseDto toResponseDto(Book book, boolean isLiked, Long likeCount, Long viewCount) {
		return BookResponseDto.builder()
				.bookId(book.getId())
				.authorName(book.getAuthor().getUserNickname()) // 가정: User 엔티티에 getUsername()이 있다고 가정
				.title(book.getTitle())
				.content(null) // ❌ 책 내용 전체를 DTO에서 반환하지 않도록 기본 null 처리 (필요하면 변경 가능)
				.coverImage(book.getCoverImage())
				.tags(book.getTags())
				.isLiked(isLiked)
				.likeCount(likeCount)
				.viewCount(viewCount)
				.createdAt(book.getCreatedAt())
				.updatedAt(book.getUpdatedAt())
				.imageUrls(null)
				.build();
	}
	public static BookResponseDto toResponseDto(Book book, boolean isLiked, Long likeCount, Long viewCount, List<String> imageUrls, boolean includeContent, String content) {
		return BookResponseDto.builder()
				.bookId(book.getId())
				.authorName(book.getAuthor().getUserNickname()) // 가정: User 엔티티에 getUsername()이 있다고 가정
				.title(book.getTitle())
				.content(includeContent ? content : null) // ✅ 상세 조회 시만 내용 포함
				.coverImage(book.getCoverImage())
				.tags(book.getTags())
				.isLiked(isLiked)
				.likeCount(likeCount)
				.viewCount(viewCount)
				.createdAt(book.getCreatedAt())
				.updatedAt(book.getUpdatedAt())
				.imageUrls(imageUrls)
				.build();
	}




}
