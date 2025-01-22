package org.ssafy.respring.event.vo;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "event")
@IdClass(EventId.class)
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
