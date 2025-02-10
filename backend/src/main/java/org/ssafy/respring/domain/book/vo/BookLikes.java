package org.ssafy.respring.domain.book.vo;

import jakarta.persistence.*;
import lombok.*;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "book_likes")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookLikes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDateTime likedAt;

    @PrePersist
    public void prePersist() {
        this.likedAt = LocalDateTime.now();
    }
}
