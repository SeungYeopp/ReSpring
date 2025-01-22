package org.ssafy.respring.challenge.vo;

import java.io.Serializable;
import java.util.Objects;

class RecordId implements Serializable {
    private Long id;
    private Long challengeId;
    private byte[] userId;

    public RecordId() {}

    public RecordId(Long id, Long challengeId, byte[] userId) {
        this.id = id;
        this.challengeId = challengeId;
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RecordId recordId = (RecordId) o;
        return Objects.equals(id, recordId.id) && Objects.equals(challengeId, recordId.challengeId) && Objects.equals(userId, recordId.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, challengeId, userId);
    }
}