package org.ssafy.respring.domain.story.vo;

import java.io.Serializable;
import java.util.Objects;

class StoryId implements Serializable {
    private Long id;
    private Long eventId;
    private byte[] userId;

    public StoryId() {}

    public StoryId(Long id, Long eventId, byte[] userId) {
        this.id = id;
        this.eventId = eventId;
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StoryId storyId = (StoryId) o;
        return Objects.equals(id, storyId.id) && Objects.equals(eventId, storyId.eventId) && Objects.equals(userId, storyId.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, eventId, userId);
    }
}
