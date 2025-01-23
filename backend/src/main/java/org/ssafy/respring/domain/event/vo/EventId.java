package org.ssafy.respring.domain.event.vo;

import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.UUID;

@EqualsAndHashCode
public class EventId implements Serializable {
    private Long id;
    private UUID userId;

    public EventId() {
    }

    public EventId(Long eventId, UUID userId) {
        this.id = eventId;
        this.userId = userId;
    }
}
