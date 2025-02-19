package org.ssafy.respring.domain.comment.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequestDto {
    private String content;
    private Long postId;
    private Long bookId;
    private Long parentId;
}