package org.ssafy.respring.domain.book.vo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.ssafy.respring.domain.image.vo.Image;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "book")
@Getter @Setter
public class Book {
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String title;
    private String content;
    private String coverImg;
    private String tag;
    private Long likes;
    private Long view;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
