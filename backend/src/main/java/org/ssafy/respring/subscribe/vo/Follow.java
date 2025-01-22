package org.ssafy.respring.subscribe.vo;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "follow")
@IdClass(FollowId.class)
public class Follow {
    @Id
    private Long followerId;

    @Id
    private Long followingId;

    @Column(name = "followed_at")
    private LocalDateTime followedAt;
}
