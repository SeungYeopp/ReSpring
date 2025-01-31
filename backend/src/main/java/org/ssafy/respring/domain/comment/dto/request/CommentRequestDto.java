package org.ssafy.respring.domain.comment.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CommentRequestDto {
    private UUID userId;
    private String content;
    private Long postId;
    private String bookId;
    private Long parentId;
}