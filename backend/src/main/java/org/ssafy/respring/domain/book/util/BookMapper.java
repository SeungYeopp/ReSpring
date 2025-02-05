package org.ssafy.respring.domain.book.util;

import org.ssafy.respring.domain.book.dto.response.BookResponseDto;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.book.vo.BookInfo;
import org.ssafy.respring.domain.comment.dto.response.CommentResponseDto;
import org.ssafy.respring.domain.image.dto.response.ImageResponseDTO;
import org.ssafy.respring.domain.story.repository.StoryRepository;
import org.ssafy.respring.domain.image.vo.Image;
import org.springframework.stereotype.Component;
import org.ssafy.respring.domain.story.vo.Story;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class BookMapper {

    public BookResponseDto toResponseDto(UUID userId, Book book, BookInfo bookInfo, List<String> storyImageUrls) {
        boolean isLiked = Optional.ofNullable(bookInfo.getLikedUsers())
                .map(likedUsers -> likedUsers.contains(userId))
                .orElse(false);

        List<CommentResponseDto> commentDtos = (bookInfo.getComments() == null) ?
                List.of() : bookInfo.getComments().stream()
                .map(comment -> new CommentResponseDto(
                        comment.getId(),
                        comment.getContent(),
                        comment.getUser().getUserNickname(),
                        comment.getCreatedAt(),
                        comment.getUpdatedAt(),
                        comment.getParent() != null ? comment.getParent().getId() : null
                ))
                .collect(Collectors.toList());

        return new BookResponseDto(
                book.getId(),
                book.getUserId(),
                bookInfo.getAuthor().getUserNickname(),
                book.getTitle(),
                book.getContent(),
                book.getCoverImage(),
                book.getTags(),
                isLiked,
                book.getLikeCount(),
                book.getViewCount(),
                book.getCreatedAt(),
                book.getUpdatedAt(),
                storyImageUrls, // Service에서 미리 조회하여 전달
                commentDtos
        );
    }
}
