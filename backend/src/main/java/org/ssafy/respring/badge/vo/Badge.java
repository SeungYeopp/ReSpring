package org.ssafy.respring.badge.vo;

import jakarta.persistence.*;
import org.ssafy.respring.user.vo.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "badge")
public class Badge {
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "earned_at")
    private LocalDateTime earnedAt;
}
