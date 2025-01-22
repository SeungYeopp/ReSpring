package org.ssafy.respring.post.vo;

import jakarta.persistence.*;
import org.ssafy.respring.user.vo.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "post")
public class Post {
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String title;
    private String content;
    private String category;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    private Long like;
}
