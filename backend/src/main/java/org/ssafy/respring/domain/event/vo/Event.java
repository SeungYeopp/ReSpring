package org.ssafy.respring.domain.event.vo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "event")
@RequiredArgsConstructor
@Getter @Setter
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "occurred_at")
    private LocalDateTime occurredAt;

    private String eventName;

    private boolean isDisplay;
    private String category;
}
