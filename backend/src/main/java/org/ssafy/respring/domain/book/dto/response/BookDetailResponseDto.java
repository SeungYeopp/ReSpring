package org.ssafy.respring.domain.book.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.comment.dto.response.CommentDto;
import org.ssafy.respring.domain.image.vo.ImageType;

import java.time.LocalDateTime;
import java.util.*;

@Data
@Builder
@AllArgsConstructor
public class BookDetailResponseDto {
	private Long id;
	private String authorNickname;
	private String authorProfileImage;
	private String title;
	private Map<String, String> content;  // ✅ 책 전체 내용 포함
	private String coverImage;
	private Set<String> tags;
	private boolean isLiked;
	private Long likeCount;
	private Long viewCount;
	private Set<String> likedUsers;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private List<String> imageUrls; // ✅ 포함된 이미지 URL 리스트 추가
	private List<CommentDto> comments; // ✅ 댓글 리스트 포함

	public static BookDetailResponseDto toResponseDto(
	  Book book,
	  String authorProfileImage,
	  Map<String, String> contentJson,
	  boolean isLiked,
	  Long likeCount,
	  Set<String> likedUsers,
	  Long viewCount,
	  List<String> imageUrls,
	  List<CommentDto> comments,
	  String coverImage
	) {
		return BookDetailResponseDto.builder()
			.id(book.getId())
			.authorNickname(book.getAuthor().getUserNickname()) // 유저 닉네임 반환
			.authorProfileImage(authorProfileImage)
			.title(book.getTitle())
			.content(contentJson) // ✅ 책 내용 포함
			.coverImage(coverImage)
			.tags(book.getTags())
			.isLiked(isLiked)
			.likedUsers(likedUsers)
			.likeCount(likeCount)
			.viewCount(viewCount)
			.createdAt(book.getCreatedAt())
			.updatedAt(book.getUpdatedAt())
			.imageUrls(imageUrls) // ✅ 이미지 포함
			.comments(comments) // ✅ 댓글 포함
			.build();
	}
}

