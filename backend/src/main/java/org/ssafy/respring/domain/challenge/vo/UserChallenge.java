package org.ssafy.respring.domain.challenge.vo;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_challenge")
@IdClass(UserChallengeId.class)
public class UserChallenge {
    @Id
    private byte[] userId;

    @Id
    private Long challengeId;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;
}
