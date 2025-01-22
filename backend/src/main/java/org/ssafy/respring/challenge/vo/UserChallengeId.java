package org.ssafy.respring.challenge.vo;

import java.io.Serializable;
import java.util.Objects;

class UserChallengeId implements Serializable {
    private byte[] userId;
    private Long challengeId;

    public UserChallengeId() {}

    public UserChallengeId(byte[] userId, Long challengeId) {
        this.userId = userId;
        this.challengeId = challengeId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserChallengeId that = (UserChallengeId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(challengeId, that.challengeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, challengeId);
    }
}
