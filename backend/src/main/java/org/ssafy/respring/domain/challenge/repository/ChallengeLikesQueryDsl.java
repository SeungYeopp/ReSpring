package org.ssafy.respring.domain.challenge.repository;

import org.ssafy.respring.domain.challenge.vo.ChallengeLikes;

import java.util.Optional;
import java.util.UUID;

public interface ChallengeLikesQueryDsl {
    Optional<ChallengeLikes> findByUserIdAndChallengeId(Long challengeId, UUID userId);
}
