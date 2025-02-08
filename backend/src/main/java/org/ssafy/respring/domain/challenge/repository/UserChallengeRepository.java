package org.ssafy.respring.domain.challenge.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.respring.domain.challenge.vo.Challenge;
import org.ssafy.respring.domain.challenge.vo.UserChallenge;
import org.ssafy.respring.domain.user.vo.User;

import java.util.List;
import java.util.Optional;

public interface UserChallengeRepository extends JpaRepository<UserChallenge, Long> {
    List<UserChallenge> findByUser(User user);
    List<UserChallenge> findByChallenge(Challenge challenge);
    Optional<UserChallenge> findByUserAndChallenge(User user, Challenge challenge);
    boolean existsByUserAndChallenge(User user, Challenge challenge);
}
