package org.ssafy.respring.domain.chat.vo;

import java.io.Serializable;
import java.util.Objects;

class ChatId implements Serializable {
    private Long id;
    private Long roomId;
    private Long challengeId;

    public ChatId() {}

    public ChatId(Long id, Long roomId, Long challengeId) {
        this.id = id;
        this.roomId = roomId;
        this.challengeId = challengeId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChatId chatId = (ChatId) o;
        return Objects.equals(id, chatId.id) && Objects.equals(roomId, chatId.roomId) && Objects.equals(challengeId, chatId.challengeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, roomId, challengeId);
    }
}