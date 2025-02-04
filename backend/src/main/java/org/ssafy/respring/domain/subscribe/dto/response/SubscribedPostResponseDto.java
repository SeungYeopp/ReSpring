package org.ssafy.respring.domain.subscribe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.ssafy.respring.domain.comment.dto.response.CommentResponseDto;
import org.ssafy.respring.domain.image.dto.response.ImageResponseDTO;
import org.ssafy.respring.domain.post.vo.Category;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class SubscribedPostResponseDto {
    private Long postId;
    private String title;
    private String content;
    private Category category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long likes;
    private List<ImageResponseDTO> images;
    private int commentCount;
    private List<CommentResponseDto> comments;

    // ✅ 추가: 게시글 작성자 정보 (구독한 사람의 게시글인지 확인)
    private UUID authorId;
    private String authorName;
}
