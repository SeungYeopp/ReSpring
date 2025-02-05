package org.ssafy.respring.domain.book.vo;

import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.ssafy.respring.domain.comment.vo.Comment;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Document(collection = "book")
@Getter @Setter
public class Book {
    @Id
    private String id; // MongoDB ObjectId
    private UUID userId;
    private String title;
    private Set<String> tags;
    private String coverImage;
    private String content; // JSON {chapterTitle: chapterContent}
    private List<String> imageUrls;
    private Set<Long> storyIds;

    private Long likeCount = 0L;  // 전체 좋아요 수
    private Long viewCount = 0L;  // 전체 조회수

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 조회수 증가
    public void increaseViewCount() {
        this.viewCount = (this.viewCount == null) ? 1 : this.viewCount + 1;
    }

    // 좋아요 수 업데이트
    public void updateLikeCount(Long count) {
        this.likeCount = count;
    }
}
