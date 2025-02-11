package org.ssafy.respring.domain.comment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class CommentDto {
    private Long id;
    private String content;
    private UUID userId;          // ✅ userId 추가
    private String userNickname;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long parentId;
}

