package org.ssafy.respring.domain.challenge.vo;

import jakarta.persistence.*;
import lombok.*;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Challenge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDateTime registerDate;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @ElementCollection(fetch = FetchType.LAZY)
    private Set<String> tags;

    private Long likes;
    private Long views;
    private Long participantCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "challenge", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserChallenge> participants;

    private String chatRoomUUID;
}
