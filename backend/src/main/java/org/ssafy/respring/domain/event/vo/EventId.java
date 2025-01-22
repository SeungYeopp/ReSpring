package org.ssafy.respring.domain.event.vo;

import java.io.Serializable;
import java.util.Objects;

class EventId implements Serializable {
    private Long eventId;
    private byte[] userId;

    public EventId() {}

    public EventId(Long eventId, byte[] userId) {
        this.eventId = eventId;
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EventId eventId1 = (EventId) o;
        return Objects.equals(eventId, eventId1.eventId) && Objects.equals(userId, eventId1.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(eventId, userId);
    }
}
