package org.ssafy.respring.domain.book.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.comment.dto.response.CommentResponseDto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
public class BookDetailResponseDto {
	private Long bookId;
	private String authorName;
	private String title;
	private String content;  // ✅ 책 전체 내용 포함
	private String coverImage;
	private Set<String> tags;
	private boolean isLiked;
	private Long likeCount;
	private Long viewCount;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private List<String> imageUrls; // ✅ 포함된 이미지 URL 리스트 추가
	private List<CommentResponseDto> comments; // ✅ 댓글 리스트 포함

	public static BookDetailResponseDto toResponseDto(
	  Book book,
	  boolean isLiked,
	  Long likeCount,
	  Long viewCount,
	  List<String> imageUrls,
	  List<CommentResponseDto> comments,
	  String content
	) {
		return BookDetailResponseDto.builder()
		  .bookId(book.getId())
		  .authorName(book.getAuthor().getUserNickname()) // 유저 닉네임 반환
		  .title(book.getTitle())
		  .content(content) // ✅ 책 내용 포함
		  .coverImage(book.getCoverImage())
		  .tags(book.getTags())
		  .isLiked(isLiked)
		  .likeCount(likeCount)
		  .viewCount(viewCount)
		  .createdAt(book.getCreatedAt())
		  .updatedAt(book.getUpdatedAt())
		  .imageUrls(imageUrls) // ✅ 이미지 포함
		  .comments(comments) // ✅ 댓글 포함
		  .build();
	}
}

