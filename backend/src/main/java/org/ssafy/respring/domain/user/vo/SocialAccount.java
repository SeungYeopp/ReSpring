package org.ssafy.respring.domain.user.vo;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "social_account")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class SocialAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    public SocialAccount(User user, String provider, String socialId, String accessToken, String refreshToken, LocalDateTime expiresAt) {
        this.user = user;
        this.provider = provider;
        this.socialId = socialId;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresAt = expiresAt;
        this.createdAt = LocalDateTime.now();
    }
}
