package org.ssafy.respring.domain.comment.vo;

import jakarta.persistence.*;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.post.vo.Post;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment")
public class Comment {
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String content;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Comment parent;

    private Integer depth;
}
