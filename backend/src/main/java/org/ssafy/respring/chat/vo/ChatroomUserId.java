package org.ssafy.respring.chat.vo;

import java.io.Serializable;
import java.util.Objects;

class ChatroomUserId implements Serializable {
    private Long roomId;
    private Long challengeId;
    private byte[] userId;

    public ChatroomUserId() {}

    public ChatroomUserId(Long roomId, Long challengeId, byte[] userId) {
        this.roomId = roomId;
        this.challengeId = challengeId;
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChatroomUserId that = (ChatroomUserId) o;
        return Objects.equals(roomId, that.roomId) && Objects.equals(challengeId, that.challengeId) && Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(roomId, challengeId, userId);
    }
}
