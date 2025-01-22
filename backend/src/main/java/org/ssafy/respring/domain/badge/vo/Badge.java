package org.ssafy.respring.domain.badge.vo;

import jakarta.persistence.*;
import org.ssafy.respring.domain.user.vo.User;

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
