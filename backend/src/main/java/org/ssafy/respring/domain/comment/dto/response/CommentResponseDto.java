package org.ssafy.respring.domain.comment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class CommentResponseDto {
    private Long id;
    private String content;
    private String userNickname;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long parentId;
}
