package org.ssafy.respring.domain.comment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class CommentDetailResponseDto {
    private Long id;
    private String content;
    private String username;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long parentId;
    private Long postId;   // ✅ 게시글 ID 추가
    private Long bookId; // ✅ 책 ID 추가
    private String postTitle;
    private String bookTitle;
    private int likeCount;  // ✅ 좋아요 개수 필드 추가
}