package org.ssafy.respring.challenge.vo;

import jakarta.persistence.*;
import org.ssafy.respring.user.vo.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "challenge")
public class Challenge {
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    private String title;
    private String description;
    private String coverImg;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    private Long like;
    private Long view;
    private String tag;
}
