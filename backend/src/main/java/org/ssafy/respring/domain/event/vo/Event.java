package org.ssafy.respring.domain.event.vo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "event")
@RequiredArgsConstructor
@Getter @Setter
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTO_INCREMENT와 연결
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "occurred_at", nullable = false)
    private LocalDateTime occurredAt;

    @Column(name = "event_name", nullable = false)
    private String eventName;

    @Column(name = "is_display", nullable = false)
    private boolean isDisplay;
    private String category;
}
