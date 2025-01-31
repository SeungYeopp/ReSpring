package org.ssafy.respring.domain.challenge.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.challenge.vo.Challenge;

import java.util.List;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    List<Challenge> findByTitleContaining(String title);
    List<Challenge> findAllByOrderByLikesDesc();
    List<Challenge> findAllByOrderByViewsDesc();
    List<Challenge> findAllByOrderByParticipantCountDesc();
    List<Challenge> findAllByOrderByStartDateDesc();
}
