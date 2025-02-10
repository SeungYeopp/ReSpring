package org.ssafy.respring.domain.tag.repository;

import org.ssafy.respring.domain.tag.vo.ChallengeTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChallengeTagRepository extends JpaRepository<ChallengeTag, Long> {
    List<ChallengeTag> findByChallengeId(Long challengeId);
}
