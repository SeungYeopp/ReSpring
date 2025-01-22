package org.ssafy.respring.user.vo;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "social_account")
public class SocialAccount {
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String provider;
    private String socialId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private String accessToken;
    private String refreshToken;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
}
