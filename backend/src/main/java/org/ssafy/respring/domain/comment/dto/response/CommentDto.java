package org.ssafy.respring.domain.comment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class CommentDto {
    private Long id;
    private String content;
    private String userNickname;
    private String profileImg;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long parentId;
    private int likeCount;  //   좋아요 개수 필드 추가
}

