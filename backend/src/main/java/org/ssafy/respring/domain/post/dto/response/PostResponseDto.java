package org.ssafy.respring.domain.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.ssafy.respring.domain.comment.dto.response.CommentDto;
import org.ssafy.respring.domain.post.vo.Category;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class PostResponseDto {
    private Long id;
    private String title;
    private String content;
    private Category category;
    private String ownerNickname;
    private String ownerProfileImage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long likes;
    private boolean isLiked;
    private List<String> images;
    private int commentCount;
    private List<CommentDto> comments;
}