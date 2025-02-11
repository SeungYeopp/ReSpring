package org.ssafy.respring.domain.tag.repository;

import org.ssafy.respring.domain.challenge.vo.Challenge;
import org.ssafy.respring.domain.tag.vo.Tag;

import java.util.List;
import java.util.UUID;

public interface TagRepositoryQueryDsl {
    List<Long> getUserTagIds(UUID userId);
    List<Challenge> recommendChallenges(UUID userId);
    List<Tag> findTagsByChallengeId(Long challengeId);
}
