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
@IdClass(EventId.class)
@RequiredArgsConstructor
@Getter @Setter
public class Event {
    @Id
    private Long id;

    @Id
    @Column(name = "user_id", columnDefinition = "BINARY(16)")
    private UUID userId;

    @Column(name = "occurred_at")
    private LocalDateTime occurredAt;

    @Column(name = "event_name")
    private String eventName;

    @Column(name = "is_display")
    private boolean isDisplay;
    private String category;
}
