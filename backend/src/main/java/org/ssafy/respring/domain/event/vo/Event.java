package org.ssafy.respring.domain.event.vo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "event")
@AllArgsConstructor
@Getter @Setter
public class Event {
    @Id
    private Long eventId;

    @Id
    private byte[] userId;

    @Column(name = "occurred_at")
    private LocalDateTime occurredAt;

    private String eventName;
    private Boolean isDisplay;
    private String category;
}
