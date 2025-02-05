package org.ssafy.respring.domain.book.util;

import org.ssafy.respring.domain.book.dto.response.BookResponseDto;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.book.vo.BookInfo;
import org.ssafy.respring.domain.comment.dto.response.CommentResponseDto;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;


@Component
public class BookMapper {
    public BookResponseDto toResponseDto(UUID userId, Book book, BookInfo bookInfo,
                                         boolean isLiked, List<CommentResponseDto> commentDtos,
                                         List<String> storyImageUrls) {
        return new BookResponseDto(
          book.getId(),
          book.getUserId(),
          bookInfo.getAuthor().getUserNickname(),
          book.getTitle(),
          book.getContent(),
          book.getCoverImage(),
          book.getTags(),
          isLiked,   // Service에서 계산된 값 전달
          book.getLikeCount(),
          book.getViewCount(),
          book.getCreatedAt(),
          book.getUpdatedAt(),
          storyImageUrls, // Service에서 미리 조회하여 전달
          commentDtos     // Service에서 변환 후 전달
        );
    }
}

