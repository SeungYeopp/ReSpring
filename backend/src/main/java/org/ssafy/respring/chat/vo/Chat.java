package org.ssafy.respring.chat.vo;

import jakarta.persistence.*;
import org.ssafy.respring.user.vo.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat")
@IdClass(ChatId.class)
public class Chat {
    @Id
    private Long id;

    @Id
    private Long roomId;

    @Id
    private Long challengeId;

    private String content;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;
}
