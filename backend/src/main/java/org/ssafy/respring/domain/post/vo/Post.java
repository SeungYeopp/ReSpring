package org.ssafy.respring.domain.post.vo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.ssafy.respring.domain.comment.vo.Comment;
import org.ssafy.respring.domain.image.vo.Image;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "post")
@RequiredArgsConstructor
@Getter @Setter
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID 자동 증가 설정
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String title;
    private String content;

    @Enumerated(EnumType.STRING) // Enum을 문자열로 저장
    private Category category;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    private Long likes;

    @ElementCollection // 사용자 UUID를 저장하는 컬렉션
    @CollectionTable(name = "post_likes", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "user_id")
    private Set<UUID> likedUsers = new HashSet<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.likes == null) {
            this.likes = 0L;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // 좋아요 추가/취소 로직
    public boolean toggleLike(UUID userId) {
        if (likedUsers.contains(userId)) {
            likedUsers.remove(userId); // 좋아요 취소
            return false;
        } else {
            likedUsers.add(userId); // 좋아요 추가
            return true;
        }
    }

}
