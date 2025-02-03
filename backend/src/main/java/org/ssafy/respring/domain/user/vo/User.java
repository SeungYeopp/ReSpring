package org.ssafy.respring.domain.user.vo;

import jakarta.persistence.*;
import lombok.*;
import org.ssafy.respring.domain.challenge.vo.Challenge;
import org.ssafy.respring.domain.challenge.vo.UserChallenge;
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

    private String userNickname;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private String email;
    private String password;
    private String profileImage;
    private String socialId;


    // 내가 만든 챌린지 (1:N)
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Challenge> createdChallenges;

    // 내가 참가한 챌린지 (N:M)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserChallenge> joinedChallenges;

    public User(String userNickname, String email, String password) {
        super();
        this.userNickname = userNickname;
        this.createdAt = LocalDateTime.now();
        this.email = email;
        this.password = password;
    }

    public User() {

    }

    public UUID getUserId() {
        return id;
    }

    public void changePassword(String encryptedPassword) {
        this.password = encryptedPassword;
    }

}
