package org.ssafy.respring.domain.book.vo;

import jakarta.persistence.*;
import lombok.*;
import org.ssafy.respring.domain.comment.vo.Comment;
import org.ssafy.respring.domain.user.vo.User;

import java.util.*;

@Entity
@Table(name = "book_info")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String bookId; // MongoDB ObjectId 참조

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User author; // 작성자 정보 (MySQL 관리)

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "book_likes", joinColumns = @JoinColumn(name = "book_info_id"))
    @Column(name = "user_id")
    private Set<UUID> likedUsers = new HashSet<>(); // 좋아요한 유저 리스트

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "book_views", joinColumns = @JoinColumn(name = "book_info_id"))
    @Column(name = "user_id")
    private Set<UUID> viewedUsers = new HashSet<>(); // 조회한 유저 리스트

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    // 좋아요 추가/삭제
    public boolean toggleLike(UUID userId) {
        boolean isLiked = likedUsers.remove(userId);
        if (!isLiked) {
            likedUsers.add(userId);
        }
        return !isLiked;
    }
}
