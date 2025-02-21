package org.ssafy.respring.domain.book.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ssafy.respring.domain.book.vo.Book;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookResponseDto {
    private Long id;
    private String authorNickname;
    private String authorProfileImage;
    private String title;
    private String coverImage;
    private Set<String> tags;
    private boolean isLiked;
    private Long likeCount;
    private Long viewCount;
    private Set<String> likedUsers;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BookResponseDto toResponseDto(Book book, boolean isLiked, Long likeCount, Set<String> likedUsers, Long viewCount, String coverImage) {
        return BookResponseDto.builder()
                .id(book.getId())
                .authorNickname(book.getAuthor().getUserNickname())
                .authorProfileImage(book.getAuthor().getProfileImage())
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