package org.ssafy.respring.domain.challenge.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.respring.domain.challenge.vo.Challenge;
import org.ssafy.respring.domain.challenge.vo.ChallengeLikes;
import org.ssafy.respring.domain.user.vo.User;

import java.util.Optional;

public interface ChallengeLikesRepository extends JpaRepository<ChallengeLikes, Long> {
    Optional<ChallengeLikes> findByUserAndChallenge(User user, Challenge challenge);
}
