package org.ssafy.respring.domain.user.vo;

import jakarta.persistence.*;
import lombok.*;
import org.ssafy.respring.domain.chat.vo.ChatMessage;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "user")
@Getter @Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    private String username;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private String email;
    private String password;
    private String profileImage;
    private String socialId;

    @OneToMany(mappedBy = "user")
    private List<ChatMessage> messages;
}
