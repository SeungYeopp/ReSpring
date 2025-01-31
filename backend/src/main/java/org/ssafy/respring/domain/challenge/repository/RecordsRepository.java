package org.ssafy.respring.domain.challenge.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.challenge.vo.Records;

import java.util.List;
import java.util.UUID;

@Repository
public interface RecordsRepository extends JpaRepository<Records, Long> {
    List<Records> findByUserId(UUID userId);
    List<Records> findByChallengeId(Long challengeId);
    boolean existsByUserIdAndChallengeId(UUID userId, Long challengeId);
}
