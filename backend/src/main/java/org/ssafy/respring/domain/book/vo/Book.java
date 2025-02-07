package org.ssafy.respring.domain.book.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.ssafy.respring.domain.comment.vo.Comment;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "book")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    // @JsonIgnoreProperties({"createdChallenges", "joinedChallenges"})
    private User author;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private Set<String> tags;

    @Column(name = "cover_image")
    private String coverImage;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "book_likes", joinColumns = @JoinColumn(name = "book_info_id"))
    @Column(name = "user_id")
    @Builder.Default
    private Set<UUID> likedUsers = new HashSet<>(); // 좋아요한 유저 리스트

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "book_views", joinColumns = @JoinColumn(name = "book_info_id"))
    @Column(name = "user_id")
    @Builder.Default
    private Set<UUID> viewedUsers = new HashSet<>(); // 조회한 유저 리스트

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "book_story", joinColumns = @JoinColumn(name = "book_id"))
    @Column(name = "story_id")
    @Builder.Default
    private Set<Long> storyIds = new HashSet<>();

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // 좋아요 추가/삭제
    public boolean toggleLike(UUID userId) {
        if (likedUsers.contains(userId)) {
            likedUsers.remove(userId);
            return false;
        } else {
            likedUsers.add(userId);
            return true;
        }
    }
}
